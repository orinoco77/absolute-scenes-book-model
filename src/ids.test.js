import { newId, now, touch } from './ids.js';

describe('newId', () => {
  test('generates unique ids even when called rapidly in succession', () => {
    const ids = new Set(Array.from({ length: 1000 }, () => newId()));
    expect(ids.size).toBe(1000);
  });
});

describe('now', () => {
  test('returns a valid ISO timestamp', () => {
    expect(new Date(now()).toString()).not.toBe('Invalid Date');
  });
});

describe('touch', () => {
  test('updates metadata.modified and preserves other fields', () => {
    const book = {
      title: 'My Book',
      metadata: { created: '2020-01-01T00:00:00.000Z', modified: '2020-01-01T00:00:00.000Z' }
    };
    const result = touch(book);
    expect(result.title).toBe('My Book');
    expect(result.metadata.created).toBe('2020-01-01T00:00:00.000Z');
    expect(result.metadata.modified).not.toBe('2020-01-01T00:00:00.000Z');
  });
});
