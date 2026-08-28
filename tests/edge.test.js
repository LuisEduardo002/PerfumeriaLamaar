import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Simulate the Edge Function's response logic for header verification
import { negotiate } from '../src/utils/acceptParser.js';

function simulateResponse(acceptHeader, path = '/') {
  const chosen = negotiate(acceptHeader, ['text/markdown', 'text/html'], 'text/html');
  if (chosen === null) {
    return {
      status: 406,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Vary': 'Accept',
      },
      body: `This resource is available in:\n- text/html\n- text/markdown\n\nYou requested: ${acceptHeader}\n`,
    };
  }
  if (chosen === 'text/markdown') {
    return {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Vary': 'Accept, Accept-Encoding',
        'Link': `<${path}>; rel="alternate"; type="text/html"`,
      },
    };
  }
  return {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Vary': 'Accept',
      'Link': `<${path}>; rel="alternate"; type="text/markdown"`,
    },
  };
}

describe('Edge Function headers and status (acceptmarkdown.com)', () => {
  it('returns markdown with correct Content-Type and Vary for Accept: text/markdown', () => {
    const res = simulateResponse('text/markdown', '/');
    assert.equal(res.status, 200);
    assert.equal(res.headers['Content-Type'], 'text/markdown; charset=utf-8');
    assert.ok(res.headers['Vary'].includes('Accept'), 'Vary should include Accept');
    assert.ok(res.headers['Link'].includes('text/html'), 'Link should point to html alternate');
  });

  it('returns html with Vary: Accept for Accept: text/html', () => {
    const res = simulateResponse('text/html', '/catalogo');
    assert.equal(res.status, 200);
    assert.equal(res.headers['Content-Type'], 'text/html; charset=utf-8');
    assert.ok(res.headers['Vary'].includes('Accept'));
  });

  it('returns html with Vary for missing Accept', () => {
    const res = simulateResponse(null, '/');
    assert.equal(res.status, 200);
    assert.equal(res.headers['Content-Type'], 'text/html; charset=utf-8');
    assert.ok(res.headers['Vary'].includes('Accept'));
  });

  it('returns html with Vary for */*', () => {
    const res = simulateResponse('*/*', '/');
    assert.equal(res.status, 200);
    assert.equal(res.headers['Content-Type'], 'text/html; charset=utf-8');
    assert.ok(res.headers['Vary'].includes('Accept'));
  });

  it('returns 406 with Vary for Accept: application/pdf', () => {
    const res = simulateResponse('application/pdf', '/');
    assert.equal(res.status, 406);
    assert.equal(res.headers['Content-Type'], 'text/plain; charset=utf-8');
    assert.equal(res.headers['Vary'], 'Accept');
    assert.ok(res.body.includes('text/html'));
    assert.ok(res.body.includes('text/markdown'));
  });

  it('respects q-values: prefers html when it has higher q', () => {
    const res = simulateResponse('text/markdown;q=0.5, text/html;q=0.9', '/');
    assert.equal(res.headers['Content-Type'], 'text/html; charset=utf-8');
  });

  it('respects q=0: markdown rejected, html served', () => {
    const res = simulateResponse('text/markdown;q=0, text/html', '/');
    assert.equal(res.headers['Content-Type'], 'text/html; charset=utf-8');
  });

  it('sets Vary: Accept, Accept-Encoding for markdown', () => {
    const res = simulateResponse('text/markdown', '/producto/al-noble-ameer');
    assert.equal(res.headers['Vary'], 'Accept, Accept-Encoding');
  });

  it('handles real Chrome header as html', () => {
    const chrome = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8';
    const res = simulateResponse(chrome, '/');
    assert.equal(res.headers['Content-Type'], 'text/html; charset=utf-8');
  });
});
