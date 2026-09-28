import { addFrontMatter, updateFrontMatter, deleteFrontMatter, toggleFrontMatter, reorderFrontMatter } from './frontMatter.js';

const baseBook = () => ({
  frontMatter: [
    { id: 'fm1', type: 'copyright', content: 'Copyright text', enabled: true },
    { id: 'fm2', type: 'dedication', content: 'To my family', enabled: true }
  ],
  metadata: { created: '2020-01-01T00:00:00.000Z', modified: '2020-01-01T00:00:00.000Z' }
});

test('addFrontMatter appends the given item as-is', () => {
  const item = { id: 'fm3', type: 'foreword', content: 'Foreword text', enabled: true };
  const result = addFrontMatter(baseBook(), item);
  expect(result.frontMatter[2]).toEqual(item);
});

describe('updateFrontMatter', () => {
  test('replaces the matching item', () => {
    const replacement = { id: 'fm1', type: 'copyright', content: 'Updated', enabled: true };
    const result = updateFrontMatter(baseBook(), 'fm1', replacement);
    expect(result.frontMatter[0]).toEqual(replacement);
  });

  test('throws when the item does not exist', () => {
    expect(() => updateFrontMatter(baseBook(), 'missing', {})).toThrow('Front matter not found: missing');
  });
});

describe('deleteFrontMatter', () => {
  test('removes the matching item', () => {
    const result = deleteFrontMatter(baseBook(), 'fm1');
    expect(result.frontMatter.map(fm => fm.id)).toEqual(['fm2']);
  });

  test('throws when the item does not exist', () => {
    expect(() => deleteFrontMatter(baseBook(), 'missing')).toThrow('Front matter not found: missing');
  });
});

describe('toggleFrontMatter', () => {
  test('sets enabled on the matching item', () => {
    const result = toggleFrontMatter(baseBook(), 'fm1', false);
    expect(result.frontMatter[0].enabled).toBe(false);
  });

  test('throws when the item does not exist', () => {
    expect(() => toggleFrontMatter(baseBook(), 'missing', false)).toThrow('Front matter not found: missing');
  });
});

describe('reorderFrontMatter', () => {
  test('moves an item to a new position', () => {
    const result = reorderFrontMatter(baseBook(), 0, 1);
    expect(result.frontMatter.map(fm => fm.id)).toEqual(['fm2', 'fm1']);
  });

  test('throws when toIndex is out of range', () => {
    expect(() => reorderFrontMatter(baseBook(), 0, 5)).toThrow('toIndex out of range: 5');
  });
});
