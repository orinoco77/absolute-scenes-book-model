let idCounter = 0;

export const newId = () =>
  `${Date.now().toString(36)}${(idCounter++).toString(36)}${Math.random()
    .toString(36)
    .slice(2, 6)}`;

export const now = () => new Date().toISOString();

export const touch = book => ({
  ...book,
  metadata: { ...book.metadata, modified: now() }
});
