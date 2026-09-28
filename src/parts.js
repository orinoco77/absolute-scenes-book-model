import { newId, now } from './ids.js';
import { requireValidIndex } from './indexRange.js';

const findPart = (book, partId) => {
  const part = book.parts.find(p => p.id === partId);
  if (!part) throw new Error(`Part not found: ${partId}`);
  return part;
};

export const addPart = book => {
  const newPart = { id: newId(), title: `Part ${book.parts.length + 1}`, chapterIds: [] };
  return {
    ...book,
    parts: [...book.parts, newPart],
    metadata: { ...book.metadata, modified: now() }
  };
};

export const updatePart = (book, partId, updates) => {
  findPart(book, partId);
  return {
    ...book,
    parts: book.parts.map(part => (part.id === partId ? { ...part, ...updates } : part)),
    metadata: { ...book.metadata, modified: now() }
  };
};

export const deletePart = (book, partId) => {
  findPart(book, partId);
  return {
    ...book,
    parts: book.parts.filter(p => p.id !== partId),
    metadata: { ...book.metadata, modified: now() }
  };
};

export const reorderParts = (book, fromIndex, toIndex) => {
  requireValidIndex(fromIndex, book.parts.length, 'fromIndex');
  requireValidIndex(toIndex, book.parts.length, 'toIndex');
  const parts = [...book.parts];
  const [movedPart] = parts.splice(fromIndex, 1);
  parts.splice(toIndex, 0, movedPart);
  return { ...book, parts, metadata: { ...book.metadata, modified: now() } };
};

// Two-pass (remove, then add) so that fromPartId === toPartId correctly
// relocates the chapter to the end of that part, instead of losing it to an
// early return inside a single .map() callback.
export const moveChapterToPart = (book, chapterId, fromPartId, toPartId) => {
  findPart(book, fromPartId);
  findPart(book, toPartId);

  const withChapterRemoved = book.parts.map(part =>
    part.id === fromPartId ? { ...part, chapterIds: part.chapterIds.filter(id => id !== chapterId) } : part
  );
  const withChapterAdded = withChapterRemoved.map(part =>
    part.id === toPartId
      ? { ...part, chapterIds: part.chapterIds.includes(chapterId) ? part.chapterIds : [...part.chapterIds, chapterId] }
      : part
  );

  return { ...book, parts: withChapterAdded, metadata: { ...book.metadata, modified: now() } };
};

export const addChapterToPart = (book, chapterId, toPartId) => {
  findPart(book, toPartId);
  const parts = book.parts.map(part => {
    if (part.id !== toPartId) return part;
    return part.chapterIds.includes(chapterId)
      ? part
      : { ...part, chapterIds: [...part.chapterIds, chapterId] };
  });
  return { ...book, parts, metadata: { ...book.metadata, modified: now() } };
};

export const removeChapterFromPart = (book, chapterId, fromPartId) => {
  findPart(book, fromPartId);
  const parts = book.parts.map(part =>
    part.id === fromPartId ? { ...part, chapterIds: part.chapterIds.filter(id => id !== chapterId) } : part
  );
  return { ...book, parts, metadata: { ...book.metadata, modified: now() } };
};

export const reorderChaptersInPart = (book, partId, fromIndex, toIndex) => {
  const part = findPart(book, partId);
  requireValidIndex(fromIndex, part.chapterIds.length, 'fromIndex');
  requireValidIndex(toIndex, part.chapterIds.length, 'toIndex');
  const parts = book.parts.map(p => {
    if (p.id !== partId) return p;
    const chapterIds = [...p.chapterIds];
    const [movedChapterId] = chapterIds.splice(fromIndex, 1);
    chapterIds.splice(toIndex, 0, movedChapterId);
    return { ...p, chapterIds };
  });
  return { ...book, parts, metadata: { ...book.metadata, modified: now() } };
};
