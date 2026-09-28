import {
  addPart, updatePart, deletePart, reorderParts,
  moveChapterToPart, addChapterToPart, removeChapterFromPart, reorderChaptersInPart
} from './parts.js';

const baseBook = () => ({
  parts: [
    { id: 'p1', title: 'Part 1', chapterIds: ['ch1'] },
    { id: 'p2', title: 'Part 2', chapterIds: ['ch2'] }
  ],
  metadata: { created: '2020-01-01T00:00:00.000Z', modified: '2020-01-01T00:00:00.000Z' }
});

test('addPart appends a part with an auto-numbered title', () => {
  const result = addPart(baseBook());
  expect(result.parts).toHaveLength(3);
  expect(result.parts[2].title).toBe('Part 3');
  expect(result.parts[2].chapterIds).toEqual([]);
});

describe('updatePart', () => {
  test('merges updates into the matching part', () => {
    const result = updatePart(baseBook(), 'p1', { title: 'Renamed' });
    expect(result.parts[0].title).toBe('Renamed');
  });

  test('throws when the part does not exist', () => {
    expect(() => updatePart(baseBook(), 'missing', { title: 'x' })).toThrow('Part not found: missing');
  });
});

describe('deletePart', () => {
  test('removes the part', () => {
    const result = deletePart(baseBook(), 'p1');
    expect(result.parts.map(p => p.id)).toEqual(['p2']);
  });

  test('throws when the part does not exist', () => {
    expect(() => deletePart(baseBook(), 'missing')).toThrow('Part not found: missing');
  });
});

describe('reorderParts', () => {
  test('moves a part to a new position', () => {
    const result = reorderParts(baseBook(), 0, 1);
    expect(result.parts.map(p => p.id)).toEqual(['p2', 'p1']);
  });

  test('throws when toIndex is out of range', () => {
    expect(() => reorderParts(baseBook(), 0, 5)).toThrow('toIndex out of range: 5');
  });

  test('throws when fromIndex is not an integer', () => {
    expect(() => reorderParts(baseBook(), undefined, 1)).toThrow('fromIndex out of range: undefined');
  });
});

describe('moveChapterToPart', () => {
  test('moves a chapter id from one part to another', () => {
    const result = moveChapterToPart(baseBook(), 'ch1', 'p1', 'p2');
    expect(result.parts.find(p => p.id === 'p1').chapterIds).toEqual([]);
    expect(result.parts.find(p => p.id === 'p2').chapterIds).toEqual(['ch2', 'ch1']);
  });

  test('does not duplicate the chapter id if it is already in the target part', () => {
    const book = { ...baseBook(), parts: [{ id: 'p1', title: 'Part 1', chapterIds: [] }, { id: 'p2', title: 'Part 2', chapterIds: ['ch1'] }] };
    const result = moveChapterToPart(book, 'ch1', 'p1', 'p2');
    expect(result.parts.find(p => p.id === 'p2').chapterIds).toEqual(['ch1']);
  });

  test('throws when the source part does not exist', () => {
    expect(() => moveChapterToPart(baseBook(), 'ch1', 'missing', 'p2')).toThrow('Part not found: missing');
  });

  test('moving within the same part relocates the chapter to the end', () => {
    const book = { ...baseBook(), parts: [{ id: 'p1', title: 'Part 1', chapterIds: ['ch1', 'ch2', 'ch3'] }] };
    const result = moveChapterToPart(book, 'ch1', 'p1', 'p1');
    expect(result.parts.find(p => p.id === 'p1').chapterIds).toEqual(['ch2', 'ch3', 'ch1']);
  });
});

describe('addChapterToPart', () => {
  test('adds a chapter id to the part', () => {
    const result = addChapterToPart(baseBook(), 'ch3', 'p1');
    expect(result.parts.find(p => p.id === 'p1').chapterIds).toEqual(['ch1', 'ch3']);
  });

  test('throws when the part does not exist', () => {
    expect(() => addChapterToPart(baseBook(), 'ch3', 'missing')).toThrow('Part not found: missing');
  });
});

describe('removeChapterFromPart', () => {
  test('removes a chapter id from the part', () => {
    const result = removeChapterFromPart(baseBook(), 'ch1', 'p1');
    expect(result.parts.find(p => p.id === 'p1').chapterIds).toEqual([]);
  });

  test('throws when the part does not exist', () => {
    expect(() => removeChapterFromPart(baseBook(), 'ch1', 'missing')).toThrow('Part not found: missing');
  });
});

describe('reorderChaptersInPart', () => {
  test('moves a chapter id to a new position within the part', () => {
    const book = { ...baseBook(), parts: [{ id: 'p1', title: 'Part 1', chapterIds: ['ch1', 'ch2', 'ch3'] }] };
    const result = reorderChaptersInPart(book, 'p1', 0, 2);
    expect(result.parts[0].chapterIds).toEqual(['ch2', 'ch3', 'ch1']);
  });

  test('throws when the part does not exist', () => {
    expect(() => reorderChaptersInPart(baseBook(), 'missing', 0, 0)).toThrow('Part not found: missing');
  });

  test('throws when toIndex is out of range', () => {
    expect(() => reorderChaptersInPart(baseBook(), 'p1', 0, 5)).toThrow('toIndex out of range: 5');
  });

  test('throws when fromIndex is not an integer', () => {
    const book = { ...baseBook(), parts: [{ id: 'p1', title: 'Part 1', chapterIds: ['ch1', 'ch2', 'ch3'] }] };
    expect(() => reorderChaptersInPart(book, 'p1', undefined, 1)).toThrow('fromIndex out of range: undefined');
  });
});
