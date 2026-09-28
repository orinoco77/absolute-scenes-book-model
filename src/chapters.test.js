import { addChapter, updateChapter, deleteChapter, reorderChapters } from './chapters.js';

const baseBook = () => ({
  chapters: [
    { id: 'ch1', title: 'Chapter 1', scenes: [], assignedAuthor: null },
    { id: 'ch2', title: 'Chapter 2', scenes: [], assignedAuthor: null }
  ],
  metadata: { created: '2020-01-01T00:00:00.000Z', modified: '2020-01-01T00:00:00.000Z' }
});

test('addChapter appends a chapter with an auto-numbered title', () => {
  const result = addChapter(baseBook());
  expect(result.chapters).toHaveLength(3);
  expect(result.chapters[2].title).toBe('Chapter 3');
  expect(result.chapters[2].scenes).toEqual([]);
});

describe('updateChapter', () => {
  test('merges updates into the matching chapter', () => {
    const result = updateChapter(baseBook(), 'ch1', { title: 'Renamed' });
    expect(result.chapters[0].title).toBe('Renamed');
  });

  test('throws when the chapter does not exist', () => {
    expect(() => updateChapter(baseBook(), 'missing', { title: 'x' })).toThrow('Chapter not found: missing');
  });
});

describe('deleteChapter', () => {
  test('removes the chapter', () => {
    const result = deleteChapter(baseBook(), 'ch2');
    expect(result.chapters.map(ch => ch.id)).toEqual(['ch1']);
  });

  test('throws when the chapter does not exist', () => {
    expect(() => deleteChapter(baseBook(), 'missing')).toThrow('Chapter not found: missing');
  });

  test('throws when it is the last remaining chapter', () => {
    const book = { ...baseBook(), chapters: [{ id: 'ch1', title: 'Chapter 1', scenes: [] }] };
    expect(() => deleteChapter(book, 'ch1')).toThrow('Cannot delete the last chapter');
  });
});

describe('reorderChapters', () => {
  test('moves a chapter to a new position', () => {
    const result = reorderChapters(baseBook(), 0, 1);
    expect(result.chapters.map(ch => ch.id)).toEqual(['ch2', 'ch1']);
  });

  test('throws when toIndex is out of range', () => {
    expect(() => reorderChapters(baseBook(), 0, 5)).toThrow('toIndex out of range: 5');
  });
});
