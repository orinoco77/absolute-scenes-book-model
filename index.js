// Public API — pure book-editing functions shared by absolute-scenes,
// absolute-scenes-mobile and absolute-scenes-mcp. Every export other than
// the queries, drafts/revisions, and recovery functions is
// (book, ...args) => newBook.
export { newId } from './src/ids.js';
export { normalizeContent } from './src/normalizeContent.js';
export { createDefaultBook, recoverBook } from './src/recovery.js';
export { updateBookMetadata, updateTemplate, updateGitHubSettings, updateGitHubSyncStatus } from './src/bookMetadata.js';
export { updateScene, addScene, deleteScene, moveSceneBetweenChapters, reorderScenesInChapter } from './src/scenes.js';
export { addChapter, updateChapter, deleteChapter, reorderChapters } from './src/chapters.js';
export { addCharacter, updateCharacter, deleteCharacter } from './src/characters.js';
export { addLocation, updateLocation, deleteLocation } from './src/locations.js';
export {
  addPart, updatePart, deletePart, reorderParts,
  moveChapterToPart, addChapterToPart, removeChapterFromPart, reorderChaptersInPart
} from './src/parts.js';
export {
  addDocument, updateDocument, deleteDocument,
  addBackgroundFolder, updateBackgroundFolder, deleteBackgroundFolder
} from './src/documents.js';
export { addFrontMatter, updateFrontMatter, deleteFrontMatter, toggleFrontMatter, reorderFrontMatter } from './src/frontMatter.js';
export { addBackMatter, updateBackMatter, deleteBackMatter, toggleBackMatter, reorderBackMatter } from './src/backMatter.js';
export { addIllustration, updateIllustration, deleteIllustration } from './src/illustrations.js';
export {
  getCurrentScene, getCurrentCharacter, getCurrentDocument,
  getCurrentLocation, getCurrentFrontMatter, getCurrentBackMatter, getCurrentIllustration
} from './src/queries.js';
export { getActiveDraft, listDrafts, getExportBook, createDraft, switchDraft, renameDraft, deleteDraft } from './src/drafts.js';
export { getRevisionInfo, createRevision, switchRevision, renameRevision, deleteRevision } from './src/revisions.js';
