import { normalizeContent } from './normalizeContent.js';

test('converts CRLF and lone CR to LF', () => {
  expect(normalizeContent('line1\r\nline2\rline3')).toBe('line1\nline2\nline3');
});

test('passes non-string values through unchanged', () => {
  expect(normalizeContent(undefined)).toBeUndefined();
  expect(normalizeContent(null)).toBeNull();
});
