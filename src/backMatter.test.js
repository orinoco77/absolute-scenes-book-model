import { addBackMatter, updateBackMatter, deleteBackMatter, toggleBackMatter, reorderBackMatter } from './backMatter.js';

const baseBook = () => ({
  backMatter: [
    { id: 'bm1', type: 'epilogue', content: 'Epilogue text', enabled: true },
    { id: 'bm2', type: 'glossary', content: 'Glossary text', enabled: true }
  ],
  metadata: { created: '2020-01-01T00:00:00.000Z', modified: '2020-01-01T00:00:00.000Z' }
});

test('addBackMatter appends the given item as-is, defaulting a missing backMatter array', () => {
  const book = { ...baseBook(), backMatter: undefined };
  const item = { id: 'bm3', type: 'appendix', content: 'Appendix text', enabled: true };
  const result = addBackMatter(book, item);
  expect(result.backMatter).toEqual([item]);
});

describe('updateBackMatter', () => {
  test('replaces the matching item', () => {
    const replacement = { id: 'bm1', type: 'epilogue', content: 'Updated', enabled: true };
    const result = updateBackMatter(baseBook(), 'bm1', replacement);
    expect(result.backMatter[0]).toEqual(replacement);
  });

  test('throws when the item does not exist', () => {
    expect(() => updateBackMatter(baseBook(), 'missing', {})).toThrow('Back matter not found: missing');
  });
});

describe('deleteBackMatter', () => {
  test('removes the matching item', () => {
    const result = deleteBackMatter(baseBook(), 'bm1');
    expect(result.backMatter.map(bm => bm.id)).toEqual(['bm2']);
  });

  test('throws when the item does not exist', () => {
    expect(() => deleteBackMatter(baseBook(), 'missing')).toThrow('Back matter not found: missing');
  });
});

describe('toggleBackMatter', () => {
  test('sets enabled on the matching item', () => {
    const result = toggleBackMatter(baseBook(), 'bm1', false);
    expect(result.backMatter[0].enabled).toBe(false);
  });

  test('throws when the item does not exist', () => {
    expect(() => toggleBackMatter(baseBook(), 'missing', false)).toThrow('Back matter not found: missing');
  });
});

describe('reorderBackMatter', () => {
  test('moves an item to a new position', () => {
    const result = reorderBackMatter(baseBook(), 0, 1);
    expect(result.backMatter.map(bm => bm.id)).toEqual(['bm2', 'bm1']);
  });

  test('throws when toIndex is out of range', () => {
    expect(() => reorderBackMatter(baseBook(), 0, 5)).toThrow('toIndex out of range: 5');
  });

  test('throws when fromIndex is not an integer', () => {
    expect(() => reorderBackMatter(baseBook(), undefined, 1)).toThrow('fromIndex out of range: undefined');
  });
});
