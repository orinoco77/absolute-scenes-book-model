import { newId, now } from './ids.js';
import { normalizeContent } from './normalizeContent.js';
import { requireValidIndex } from './indexRange.js';

const findScene = (book, sceneId) => {
  for (const chapter of book.chapters) {
    const scene = chapter.scenes.find(s => s.id === sceneId);
    if (scene) return scene;
  }
  return null;
};

const findChapter = (book, chapterId) => {
  const chapter = book.chapters.find(ch => ch.id === chapterId);
  if (!chapter) throw new Error(`Chapter not found: ${chapterId}`);
  return chapter;
};

export const updateScene = (book, sceneId, updates) => {
  if (!findScene(book, sceneId)) throw new Error(`Scene not found: ${sceneId}`);

  const normalizedUpdates = { ...updates };
  if (normalizedUpdates.content) {
    normalizedUpdates.content = normalizeContent(normalizedUpdates.content);
  }
  if (normalizedUpdates.notes) {
    normalizedUpdates.notes = normalizeContent(normalizedUpdates.notes);
  }

  return {
    ...book,
    chapters: book.chapters.map(chapter => ({
      ...chapter,
      scenes: chapter.scenes.map(scene =>
        scene.id === sceneId ? { ...scene, ...normalizedUpdates, modified: now() } : scene
      )
    })),
    metadata: { ...book.metadata, modified: now() }
  };
};

export const addScene = (book, chapterId) => {
  const chapter = findChapter(book, chapterId);
  const newScene = {
    id: newId(),
    title: `Scene ${chapter.scenes.length + 1}`,
    content: '',
    notes: '',
    created: now(),
    modified: now(),
    assignedAuthor: null
  };

  return {
    ...book,
    chapters: book.chapters.map(ch =>
      ch.id === chapterId ? { ...ch, scenes: [...ch.scenes, newScene] } : ch
    ),
    metadata: { ...book.metadata, modified: now() }
  };
};

export const deleteScene = (book, sceneId) => {
  if (!findScene(book, sceneId)) throw new Error(`Scene not found: ${sceneId}`);

  return {
    ...book,
    chapters: book.chapters.map(chapter => ({
      ...chapter,
      scenes: chapter.scenes.filter(scene => scene.id !== sceneId)
    })),
    metadata: { ...book.metadata, modified: now() }
  };
};

// Two-pass (remove, then add) so that fromChapterId === toChapterId correctly
// relocates the scene to the end of that chapter, instead of losing it to an
// early return inside a single .map() callback.
export const moveSceneBetweenChapters = (book, sceneId, fromChapterId, toChapterId) => {
  const fromChapter = findChapter(book, fromChapterId);
  findChapter(book, toChapterId);
  const sceneToMove = fromChapter.scenes.find(s => s.id === sceneId);
  if (!sceneToMove) throw new Error(`Scene not found in chapter ${fromChapterId}: ${sceneId}`);

  const withSceneRemoved = book.chapters.map(chapter =>
    chapter.id === fromChapterId
      ? { ...chapter, scenes: chapter.scenes.filter(s => s.id !== sceneId) }
      : chapter
  );
  const withSceneAdded = withSceneRemoved.map(chapter =>
    chapter.id === toChapterId ? { ...chapter, scenes: [...chapter.scenes, sceneToMove] } : chapter
  );

  return {
    ...book,
    chapters: withSceneAdded,
    metadata: { ...book.metadata, modified: now() }
  };
};

export const reorderScenesInChapter = (book, chapterId, fromIndex, toIndex) => {
  const chapter = findChapter(book, chapterId);
  requireValidIndex(fromIndex, chapter.scenes.length, 'fromIndex');
  requireValidIndex(toIndex, chapter.scenes.length, 'toIndex');

  return {
    ...book,
    chapters: book.chapters.map(ch => {
      if (ch.id !== chapterId) return ch;
      const scenes = [...ch.scenes];
      const [movedScene] = scenes.splice(fromIndex, 1);
      scenes.splice(toIndex, 0, movedScene);
      return { ...ch, scenes };
    }),
    metadata: { ...book.metadata, modified: now() }
  };
};
