import { updateBookMetadata, updateTemplate, updateGitHubSettings, updateGitHubSyncStatus } from './bookMetadata.js';

const baseBook = () => ({
  title: 'Old Title',
  template: { fontFamily: 'Georgia', fontSize: 12 },
  github: { repository: null, lastSyncTime: null },
  metadata: { created: '2020-01-01T00:00:00.000Z', modified: '2020-01-01T00:00:00.000Z' }
});

test('updateBookMetadata merges top-level fields and bumps modified', () => {
  const result = updateBookMetadata(baseBook(), { title: 'New Title' });
  expect(result.title).toBe('New Title');
  expect(result.metadata.modified).not.toBe('2020-01-01T00:00:00.000Z');
});

test('updateTemplate merges into template without replacing untouched fields', () => {
  const result = updateTemplate(baseBook(), { fontSize: 14 });
  expect(result.template.fontFamily).toBe('Georgia');
  expect(result.template.fontSize).toBe(14);
});

test('updateGitHubSettings merges into github and bumps modified', () => {
  const result = updateGitHubSettings(baseBook(), { repository: { full_name: 'me/book' } });
  expect(result.github.repository).toEqual({ full_name: 'me/book' });
  expect(result.metadata.modified).not.toBe('2020-01-01T00:00:00.000Z');
});

test('updateGitHubSyncStatus merges into github but does NOT bump metadata.modified', () => {
  const book = baseBook();
  const result = updateGitHubSyncStatus(book, { lastSyncTime: '2026-01-01T00:00:00.000Z' });
  expect(result.github.lastSyncTime).toBe('2026-01-01T00:00:00.000Z');
  expect(result.metadata.modified).toBe(book.metadata.modified);
});
