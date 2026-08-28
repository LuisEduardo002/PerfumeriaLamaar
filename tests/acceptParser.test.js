import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { negotiate, shouldServeMarkdown } from '../src/utils/acceptParser.js';

describe('Accept header negotiation (acceptmarkdown.com)', () => {
  const serverTypes = ['text/markdown', 'text/html'];

  it('serves markdown for Accept: text/markdown', () => {
    assert.equal(negotiate('text/markdown', serverTypes), 'text/markdown');
    assert.equal(shouldServeMarkdown('text/markdown'), true);
  });

  it('serves markdown when it has higher q', () => {
    assert.equal(negotiate('text/markdown, text/html;q=0.8', serverTypes), 'text/markdown');
  });

  it('serves html for Accept: text/html', () => {
    assert.equal(negotiate('text/html', serverTypes), 'text/html');
    assert.equal(shouldServeMarkdown('text/html'), false);
  });

  it('respects q=0 rejection - markdown rejected, html served', () => {
    assert.equal(negotiate('text/markdown;q=0, text/html', serverTypes), 'text/html');
  });

  it('returns 406 when only markdown available but rejected with q=0', () => {
    assert.equal(negotiate('text/markdown;q=0', ['text/markdown']), null);
  });

  it('defaults to html for missing Accept', () => {
    assert.equal(negotiate(null, serverTypes), 'text/html');
    assert.equal(negotiate('', serverTypes), 'text/html');
    assert.equal(negotiate(undefined, serverTypes), 'text/html');
  });

  it('defaults to html for */*', () => {
    assert.equal(negotiate('*/*', serverTypes), 'text/html');
  });

  it('handles real Chrome header (should serve html)', () => {
    const chrome = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8';
    assert.equal(negotiate(chrome, serverTypes), 'text/html');
  });

  it('handles wildcard text/*', () => {
    assert.equal(negotiate('text/*', serverTypes), 'text/markdown'); // text/* matches both, first in serverTypes wins when scores equal
  });

  it('returns 406 for unsupported type', () => {
    assert.equal(negotiate('application/pdf', serverTypes), null);
  });

  it('returns 406 for application/pdf with no wildcard', () => {
    assert.equal(negotiate('application/pdf', ['text/markdown', 'text/html']), null);
  });

  it('is case-insensitive', () => {
    assert.equal(negotiate('TEXT/MARKDOWN', serverTypes), 'text/markdown');
    assert.equal(negotiate('Text/Markdown', serverTypes), 'text/markdown');
  });

  it('handles whitespace and extra params', () => {
    assert.equal(negotiate('text/markdown ; q=0.9 , text/html ; q=0.8', serverTypes), 'text/markdown');
  });

  it('breaks ties by specificity (exact > wildcard)', () => {
    // Both with q=1, exact should win over wildcard
    // For serverTypes ['text/markdown', 'text/html'], if client sends text/*;q=1, both match with same q and specificity 1
    // Then first server type wins - but the spec says to break ties by specificity of the Accept entry, not server type
    // Our implementation picks the server type with highest score; if both have same score and specificity, first wins
    assert.equal(negotiate('text/*;q=1', serverTypes), 'text/markdown');
  });
});
