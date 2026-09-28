import { addIllustration, updateIllustration, deleteIllustration } from './illustrations.js';

const baseBook = () => ({
  illustrations: [{ id: 'i1', page: 3, caption: 'A map', altText: 'Map of the realm' }],
  metadata: { created: '2020-01-01T00:00:00.000Z', modified: '2020-01-01T00:00:00.000Z' }
});

test('addIllustration appends the given item as-is, defaulting a missing illustrations array', () => {
  const book = { ...baseBook(), illustrations: undefined };
  const item = { id: 'i2', page: 10, caption: 'A portrait', altText: 'Portrait of the king' };
  const result = addIllustration(book, item);
  expect(result.illustrations).toEqual([item]);
});

describe('updateIllustration', () => {
  test('replaces the matching item', () => {
    const replacement = { id: 'i1', page: 5, caption: 'A map', altText: 'Map of the realm' };
    const result = updateIllustration(baseBook(), 'i1', replacement);
    expect(result.illustrations[0]).toEqual(replacement);
  });

  test('throws when the item does not exist', () => {
    expect(() => updateIllustration(baseBook(), 'missing', {})).toThrow('Illustration not found: missing');
  });
});

describe('deleteIllustration', () => {
  test('removes the matching item', () => {
    const result = deleteIllustration(baseBook(), 'i1');
    expect(result.illustrations).toEqual([]);
  });

  test('throws when the item does not exist', () => {
    expect(() => deleteIllustration(baseBook(), 'missing')).toThrow('Illustration not found: missing');
  });
});
