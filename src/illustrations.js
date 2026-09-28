import { now } from './ids.js';

export const addIllustration = (book, illustration) => ({
  ...book,
  illustrations: [...(book.illustrations || []), illustration],
  metadata: { ...book.metadata, modified: now() }
});

const requireIllustration = (book, illustrationId) => {
  if (!(book.illustrations || []).some(ill => ill.id === illustrationId)) {
    throw new Error(`Illustration not found: ${illustrationId}`);
  }
};

export const updateIllustration = (book, illustrationId, updatedIllustration) => {
  requireIllustration(book, illustrationId);
  return {
    ...book,
    illustrations: (book.illustrations || []).map(ill => (ill.id === illustrationId ? updatedIllustration : ill)),
    metadata: { ...book.metadata, modified: now() }
  };
};

export const deleteIllustration = (book, illustrationId) => {
  requireIllustration(book, illustrationId);
  return {
    ...book,
    illustrations: (book.illustrations || []).filter(ill => ill.id !== illustrationId),
    metadata: { ...book.metadata, modified: now() }
  };
};
