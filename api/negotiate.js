/**
 * Vercel Edge Function — Markdown content negotiation
 * Handles Accept: text/markdown per https://acceptmarkdown.com
 * Runtime: edge
 */
export const config = {
  runtime: 'edge',
};

function parseAcceptHeader(header) {
  if (!header || header.trim() === '') return [];
  return header
    .split(',')
    .map((part) => {
      const [rawType, ...paramParts] = part.split(';').map((s) => s.trim());
      const type = rawType.toLowerCase().trim();
      let q = 1;
      for (const param of paramParts) {
        const [key, value] = param.split('=').map((s) => s.trim());
        if (key.toLowerCase() === 'q') {
          const parsed = parseFloat(value);
          if (!Number.isNaN(parsed)) q = parsed;
        }
      }
      let specificity = 0;
      if (type === '*/*') specificity = 0;
      else if (type.endsWith('/*')) specificity = 1;
      else specificity = 2;
      return { type, q, specificity };
    })
    .sort((a, b) => {
      if (b.q !== a.q) return b.q - a.q;
      return b.specificity - a.specificity;
    });
}

function matches(acceptType, serverType) {
  const a = acceptType.toLowerCase();
  const s = serverType.toLowerCase();
  if (a === s) return true;
  if (a === '*/*') return true;
  if (a.endsWith('/*')) {
    const prefix = a.slice(0, -2);
    return s.startsWith(prefix + '/');
  }
  return false;
}

function negotiate(acceptHeader, serverTypes = ['text/markdown', 'text/html'], defaultType = 'text/html') {
  if (!acceptHeader || acceptHeader.trim() === '') return defaultType;
  const trimmed = acceptHeader.trim().toLowerCase();
  if (trimmed === '*/*' || trimmed.startsWith('*/*;') || trimmed === '*/*;q=1' || trimmed === '*/*; q=1') {
    const qMatch = trimmed.match(/q=([0-9.]+)/);
    const q = qMatch ? parseFloat(qMatch[1]) : 1;
    if (q === 0) return null;
    return defaultType;
  }
  const parsed = parseAcceptHeader(acceptHeader);
  if (parsed.length === 0) return defaultType;
  if (parsed.length === 1 && parsed[0].type === '*/*') {
    if (parsed[0].q === 0) return null;
    return defaultType;
  }

  let bestType = null;
  let bestScore = -1;
  let bestSpec = -1;

  for (const serverType of serverTypes) {
    let score = 0;
    let spec = -1;
    for (const entry of parsed) {
      if (matches(entry.type, serverType)) {
        if (entry.q === 0) {
          score = 0;
          spec = entry.specificity;
          break;
        }
        score = entry.q;
        spec = entry.specificity;
        break;
      }
    }
    if (score > bestScore || (score === bestScore && spec > bestSpec)) {
      bestScore = score;
      bestSpec = spec;
      bestType = serverType;
    }
  }

  if (bestScore === 0) return null;
  return bestType;
}

function getMarkdownPath(pathname) {
  if (pathname === '/' || pathname === '') return '/__markdown/home.md';
  const clean = pathname.replace(/\/+$/, '') || '/';
  const file = clean.replace(/^\//, '') + '.md';
  return `/__markdown/${file}`;
}

export default async function handler(request) {
  const url = new URL(request.url);
  // Prefer ?path= query param if present (from vercel.json rewrite), otherwise use pathname
  const pathParam = url.searchParams.get('path');
  const pathname = pathParam || url.pathname;
  const accept = request.headers.get('accept') || '';

  const chosen = negotiate(accept, ['text/markdown', 'text/html'], 'text/html');

  // 406 Not Acceptable
  if (chosen === null) {
    return new Response(
      `This resource is available in:\n- text/html\n- text/markdown\n\nYou requested: ${accept}\n`,
      {
        status: 406,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Vary': 'Accept',
          'Cache-Control': 'no-store',
        },
      }
    );
  }

  if (chosen === 'text/html') {
    // Serve the SPA shell (index.html) with Vary header
    const htmlUrl = new URL('/index.html', request.url);
    const htmlResponse = await fetch(htmlUrl.toString(), {
      headers: { 'x-middleware-bypass': '1' },
    });

    const headers = new Headers(htmlResponse.headers);
    const existingVary = headers.get('Vary');
    if (existingVary) {
      const parts = existingVary.split(',').map((s) => s.trim().toLowerCase());
      if (!parts.includes('accept')) {
        headers.set('Vary', existingVary + ', Accept');
      }
    } else {
      headers.set('Vary', 'Accept');
    }
    // Ensure Vary also includes Accept-Encoding if present
    const vary = headers.get('Vary') || '';
    if (!vary.toLowerCase().includes('accept-encoding') && htmlResponse.headers.get('Content-Encoding')) {
      headers.set('Vary', vary ? vary + ', Accept-Encoding' : 'Accept, Accept-Encoding');
    }
    headers.set('Link', `<${pathname}>; rel="alternate"; type="text/markdown"`);

    const body = await htmlResponse.arrayBuffer();
    return new Response(body, {
      status: htmlResponse.status,
      headers,
    });
  }

  // Markdown chosen
  const mdPath = getMarkdownPath(pathname);
  const mdUrl = new URL(mdPath, request.url);

  let mdResponse;
  try {
    mdResponse = await fetch(mdUrl.toString(), {
      headers: { 'x-middleware-bypass': '1' },
    });
  } catch {
    mdResponse = null;
  }

  if (!mdResponse || !mdResponse.ok) {
    // Fallback to HTML if markdown not found (e.g., unknown product slug)
    const htmlUrl = new URL('/index.html', request.url);
    const fallback = await fetch(htmlUrl.toString(), { headers: { 'x-middleware-bypass': '1' } });
    const headers = new Headers(fallback.headers);
    headers.set('Vary', 'Accept');
    headers.set('Link', `<${pathname}>; rel="alternate"; type="text/markdown"`);
    const body = await fallback.arrayBuffer();
    return new Response(body, { status: fallback.status, headers });
  }

  const mdBody = await mdResponse.arrayBuffer();
  const headers = new Headers();
  headers.set('Content-Type', 'text/markdown; charset=utf-8');
  headers.set('Vary', 'Accept, Accept-Encoding');
  headers.set('Cache-Control', 'public, max-age=300');
  headers.set('Link', `<${pathname}>; rel="alternate"; type="text/html"`);

  return new Response(mdBody, {
    status: 200,
    headers,
  });
}
