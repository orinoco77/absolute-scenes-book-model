import { now } from './ids.js';

export const addBackMatter = (book, backMatterItem) => ({
  ...book,
  backMatter: [...(book.backMatter || []), backMatterItem],
  metadata: { ...book.metadata, modified: now() }
});

const requireBackMatter = (book, backMatterId) => {
  if (!(book.backMatter || []).some(bm => bm.id === backMatterId)) {
    throw new Error(`Back matter not found: ${backMatterId}`);
  }
};

export const updateBackMatter = (book, backMatterId, updatedBackMatter) => {
  requireBackMatter(book, backMatterId);
  return {
    ...book,
    backMatter: (book.backMatter || []).map(bm => (bm.id === backMatterId ? updatedBackMatter : bm)),
    metadata: { ...book.metadata, modified: now() }
  };
};

export const deleteBackMatter = (book, backMatterId) => {
  requireBackMatter(book, backMatterId);
  return {
    ...book,
    backMatter: (book.backMatter || []).filter(bm => bm.id !== backMatterId),
    metadata: { ...book.metadata, modified: now() }
  };
};

export const toggleBackMatter = (book, backMatterId, enabled) => {
  requireBackMatter(book, backMatterId);
  return {
    ...book,
    backMatter: (book.backMatter || []).map(bm => (bm.id === backMatterId ? { ...bm, enabled } : bm)),
    metadata: { ...book.metadata, modified: now() }
  };
};

export const reorderBackMatter = (book, fromIndex, toIndex) => {
  const backMatter = [...(book.backMatter || [])];
  if (fromIndex < 0 || fromIndex >= backMatter.length) throw new Error(`fromIndex out of range: ${fromIndex}`);
  if (toIndex < 0 || toIndex >= backMatter.length) throw new Error(`toIndex out of range: ${toIndex}`);
  const [movedItem] = backMatter.splice(fromIndex, 1);
  backMatter.splice(toIndex, 0, movedItem);
  return { ...book, backMatter, metadata: { ...book.metadata, modified: now() } };
};
