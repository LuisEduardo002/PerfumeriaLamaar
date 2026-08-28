/**
 * Accept header parser for Markdown content negotiation.
 * Follows acceptmarkdown.com / RFC 9110 5.3.2 and 12.5.1
 *
 * - Sorts by q descending, then specificity (exact > text/* > star-star)
 * - Respects q=0 (explicit rejection)
 * - Case-insensitive type matching
 * - Handles missing header and star-star as "no constraint" (defaults to HTML)
 */

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

      // Specificity: 2 = exact (text/markdown), 1 = subtype wildcard (text/*), 0 = star-star
      let specificity = 0;
      if (type === '*/*') specificity = 0;
      else if (type.endsWith('/*')) specificity = 1;
      else specificity = 2;

      return { type, q, specificity, raw: part.trim() };
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

/**
 * Negotiate between server-supported types based on Accept header.
 * @param {string|null} acceptHeader - Raw Accept header value
 * @param {string[]} serverTypes - e.g. ['text/markdown', 'text/html']
 * @param {string} defaultType - Fallback when no Accept or star-star (default: 'text/html')
 * @returns {string|null} - Chosen type or null if 406
 */
export function negotiate(acceptHeader, serverTypes = ['text/markdown', 'text/html'], defaultType = 'text/html') {
  // Missing or empty header means no constraint -> default
  if (!acceptHeader || acceptHeader.trim() === '') {
    return defaultType;
  }

  const trimmed = acceptHeader.trim().toLowerCase();
  // Accept: */* means "anything is fine" -> default, not markdown
  if (trimmed === '*/*' || trimmed.startsWith('*/*;') || trimmed === '*/*;q=1' || trimmed === '*/*; q=1') {
    const qMatch = trimmed.match(/q=([0-9.]+)/);
    const q = qMatch ? parseFloat(qMatch[1]) : 1;
    if (q === 0) return null;
    return defaultType;
  }

  const parsed = parseAcceptHeader(acceptHeader);

  // If header is present but parsing yields nothing valid, default
  if (parsed.length === 0) return defaultType;

  // Single wildcard entry -> default
  if (parsed.length === 1 && parsed[0].type === '*/*') {
    if (parsed[0].q === 0) return null;
    return defaultType;
  }

  let bestType = null;
  let bestScore = -1;
  let bestSpecificity = -1;

  for (const serverType of serverTypes) {
    let score = 0;
    let specificity = -1;

    for (const entry of parsed) {
      if (matches(entry.type, serverType)) {
        // q=0 means explicitly not acceptable
        if (entry.q === 0) {
          score = 0;
          specificity = entry.specificity;
          break;
        }
        score = entry.q;
        specificity = entry.specificity;
        break; // first matching entry is the highest priority match (sorted)
      }
    }

    // If no entry matched, check for */* fallback in parsed list
    // matches() already handles */* so if we got here with score 0 and no break,
    // it means no match at all -> score stays 0

    if (score > bestScore || (score === bestScore && specificity > bestSpecificity)) {
      bestScore = score;
      bestSpecificity = specificity;
      bestType = serverType;
    }
  }

  // If best score is 0, no acceptable representation -> 406
  // But check if there's a wildcard that would give a default
  // The spec says if no Accept header or */*, we defaulted already
  // If we get here with score 0, it means client explicitly has no acceptable type
  if (bestScore === 0) {
    // Check if client sent something like Accept: */* with q=0? That's still 0
    // Check if there's any entry that would match but with q=0, we already handled
    return null;
  }

  return bestType;
}

export function shouldServeMarkdown(acceptHeader) {
  const chosen = negotiate(acceptHeader, ['text/markdown', 'text/html'], 'text/html');
  return chosen === 'text/markdown';
}

// For testing: check if Vary header needs to be set
export function getVaryHeader() {
  return 'Accept';
}
