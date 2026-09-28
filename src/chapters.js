import { newId, now } from './ids.js';
import { requireValidIndex } from './indexRange.js';

export const addChapter = book => {
  const newChapter = {
    id: newId(),
    title: `Chapter ${book.chapters.length + 1}`,
    scenes: [],
    assignedAuthor: null
  };
  return {
    ...book,
    chapters: [...book.chapters, newChapter],
    metadata: { ...book.metadata, modified: now() }
  };
};

export const updateChapter = (book, chapterId, updates) => {
  if (!book.chapters.some(ch => ch.id === chapterId)) {
    throw new Error(`Chapter not found: ${chapterId}`);
  }
  return {
    ...book,
    chapters: book.chapters.map(chapter =>
      chapter.id === chapterId ? { ...chapter, ...updates } : chapter
    ),
    metadata: { ...book.metadata, modified: now() }
  };
};

export const deleteChapter = (book, chapterId) => {
  if (!book.chapters.some(ch => ch.id === chapterId)) {
    throw new Error(`Chapter not found: ${chapterId}`);
  }
  if (book.chapters.length <= 1) {
    throw new Error('Cannot delete the last chapter');
  }
  return {
    ...book,
    chapters: book.chapters.filter(ch => ch.id !== chapterId),
    metadata: { ...book.metadata, modified: now() }
  };
};

export const reorderChapters = (book, fromIndex, toIndex) => {
  requireValidIndex(fromIndex, book.chapters.length, 'fromIndex');
  requireValidIndex(toIndex, book.chapters.length, 'toIndex');
  const chapters = [...book.chapters];
  const [movedChapter] = chapters.splice(fromIndex, 1);
  chapters.splice(toIndex, 0, movedChapter);
  return {
    ...book,
    chapters,
    metadata: { ...book.metadata, modified: now() }
  };
};
