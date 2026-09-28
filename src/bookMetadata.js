import { now } from './ids.js';

export const updateBookMetadata = (book, metadata) => ({
  ...book,
  ...metadata,
  metadata: { ...book.metadata, modified: now() }
});

export const updateTemplate = (book, templateUpdates) => ({
  ...book,
  template: { ...book.template, ...templateUpdates },
  metadata: { ...book.metadata, modified: now() }
});

export const updateGitHubSettings = (book, settings) => ({
  ...book,
  github: { ...book.github, ...settings },
  metadata: { ...book.metadata, modified: now() }
});

// Sync bookkeeping only — deliberately does not bump metadata.modified,
// so a sync completing doesn't itself mark the book as having unsaved changes.
export const updateGitHubSyncStatus = (book, settings) => ({
  ...book,
  github: { ...book.github, ...settings }
});
