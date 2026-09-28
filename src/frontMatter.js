import { now } from './ids.js';
import { requireValidIndex } from './indexRange.js';

export const addFrontMatter = (book, frontMatterItem) => ({
  ...book,
  frontMatter: [...book.frontMatter, frontMatterItem],
  metadata: { ...book.metadata, modified: now() }
});

const requireFrontMatter = (book, frontMatterId) => {
  if (!book.frontMatter.some(fm => fm.id === frontMatterId)) {
    throw new Error(`Front matter not found: ${frontMatterId}`);
  }
};

export const updateFrontMatter = (book, frontMatterId, updatedFrontMatter) => {
  requireFrontMatter(book, frontMatterId);
  return {
    ...book,
    frontMatter: book.frontMatter.map(fm => (fm.id === frontMatterId ? updatedFrontMatter : fm)),
    metadata: { ...book.metadata, modified: now() }
  };
};

export const deleteFrontMatter = (book, frontMatterId) => {
  requireFrontMatter(book, frontMatterId);
  return {
    ...book,
    frontMatter: book.frontMatter.filter(fm => fm.id !== frontMatterId),
    metadata: { ...book.metadata, modified: now() }
  };
};

export const toggleFrontMatter = (book, frontMatterId, enabled) => {
  requireFrontMatter(book, frontMatterId);
  return {
    ...book,
    frontMatter: book.frontMatter.map(fm => (fm.id === frontMatterId ? { ...fm, enabled } : fm)),
    metadata: { ...book.metadata, modified: now() }
  };
};

export const reorderFrontMatter = (book, fromIndex, toIndex) => {
  requireValidIndex(fromIndex, book.frontMatter.length, 'fromIndex');
  requireValidIndex(toIndex, book.frontMatter.length, 'toIndex');
  const frontMatter = [...book.frontMatter];
  const [movedItem] = frontMatter.splice(fromIndex, 1);
  frontMatter.splice(toIndex, 0, movedItem);
  return { ...book, frontMatter, metadata: { ...book.metadata, modified: now() } };
};
