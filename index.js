// Public API — each export is added by the task that implements it.

export { updateBookMetadata, updateTemplate, updateGitHubSettings, updateGitHubSyncStatus } from './src/bookMetadata.js';
export { updateScene, addScene, deleteScene, moveSceneBetweenChapters, reorderScenesInChapter } from './src/scenes.js';
export { addChapter, updateChapter, deleteChapter, reorderChapters } from './src/chapters.js';
export { addCharacter, updateCharacter, deleteCharacter } from './src/characters.js';
export { addLocation, updateLocation, deleteLocation } from './src/locations.js';
export {
  addPart, updatePart, deletePart, reorderParts,
  moveChapterToPart, addChapterToPart, removeChapterFromPart, reorderChaptersInPart
} from './src/parts.js';
