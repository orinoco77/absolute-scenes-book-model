import {
  createDefaultBook, addChapter, addScene, updateScene, getCurrentScene,
  addCharacter, createDraft, getActiveDraft
} from './index.js';

test('a full create-book, add-chapter, add-scene, edit-scene flow works through the public API', () => {
  let book = createDefaultBook();

  book = addChapter(book);
  const chapterId = book.chapters[1].id;

  book = addScene(book, chapterId);
  const sceneId = book.chapters[1].scenes[0].id;

  book = updateScene(book, sceneId, { content: 'It was a dark and stormy night.' });
  expect(getCurrentScene(book, sceneId).content).toBe('It was a dark and stormy night.');

  book = addCharacter(book);
  expect(book.characters).toHaveLength(1);

  book = createDraft(book, { name: 'Alternate ending', mode: 'copy' });
  expect(getActiveDraft(book).id).toBe('default-draft');
  expect(book.drafts).toHaveLength(1);
  expect(book.drafts[0].chapters[1].scenes[0].content).toBe('It was a dark and stormy night.');
});
