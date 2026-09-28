import { createDefaultBook, recoverBook } from './recovery.js';

test('createDefaultBook returns a single-chapter book with template defaults', () => {
  const book = createDefaultBook();
  expect(book.chapters).toHaveLength(1);
  expect(book.chapters[0].title).toBe('Chapter 1');
  expect(book.chapters[0].scenes).toEqual([]);
  expect(book.template.fontFamily).toBe('Times New Roman');
  expect(book.github.repository).toBeNull();
  expect(book.backgroundFolders[0].title).toBe('General Notes');
});

test('recoverBook migrates a legacy top-level scenes array into chapters', () => {
  const legacy = {
    scenes: [{ id: 's1', title: 'Scene 1', content: 'Hello', notes: '' }],
    metadata: { created: '2020-01-01T00:00:00.000Z', modified: '2020-01-01T00:00:00.000Z' }
  };
  const result = recoverBook(legacy);
  expect(result.scenes).toBeUndefined();
  expect(result.chapters).toEqual([
    { id: 'default', title: 'Chapter 1', scenes: [{ id: 's1', title: 'Scene 1', content: 'Hello', notes: '' }] }
  ]);
});

test('recoverBook normalizes line endings across scenes, front/back matter, characters, and locations', () => {
  const raw = {
    chapters: [{ id: 'ch1', title: 'Chapter 1', scenes: [{ id: 's1', title: 'S1', content: 'a\r\nb', notes: 'n\r\nn' }] }],
    frontMatter: [{ id: 'fm1', content: 'x\r\ny' }],
    backMatter: [{ id: 'bm1', content: 'p\r\nq' }],
    characters: [{ id: 'c1', description: 'd\r\nd', notes: 'nn\r\nnn' }],
    locations: [{ id: 'l1', description: 'e\r\ne' }],
    metadata: { created: '2020-01-01T00:00:00.000Z', modified: '2020-01-01T00:00:00.000Z' }
  };
  const result = recoverBook(raw);
  expect(result.chapters[0].scenes[0].content).toBe('a\nb');
  expect(result.chapters[0].scenes[0].notes).toBe('n\nn');
  expect(result.frontMatter[0].content).toBe('x\ny');
  expect(result.backMatter[0].content).toBe('p\nq');
  expect(result.characters[0].description).toBe('d\nd');
  expect(result.locations[0].description).toBe('e\ne');
});

test('recoverBook fills in missing arrays and github settings', () => {
  const raw = {
    chapters: [{ id: 'ch1', title: 'Chapter 1', scenes: [] }],
    metadata: { created: '2020-01-01T00:00:00.000Z', modified: '2020-01-01T00:00:00.000Z' }
  };
  const result = recoverBook(raw);
  expect(result.frontMatter).toEqual([]);
  expect(result.parts).toEqual([]);
  expect(result.characters).toEqual([]);
  expect(result.characterDetectionBlacklist).toEqual([]);
  expect(result.locations).toEqual([]);
  expect(result.backgroundFolders).toEqual([{ id: 'default-bg', title: 'General Notes', documents: [] }]);
  expect(result.github).toEqual({ repository: null, lastSyncTime: null });
});
