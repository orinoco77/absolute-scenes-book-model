export const getCurrentScene = (book, sceneId) => {
  if (!sceneId) return null;
  for (const chapter of book.chapters) {
    const scene = chapter.scenes.find(scene => scene.id === sceneId);
    if (scene) return scene;
  }
  return null;
};

export const getCurrentCharacter = (book, characterId) => {
  if (!characterId) return null;
  return book.characters.find(character => character.id === characterId) || null;
};

export const getCurrentDocument = (book, documentId) => {
  if (!documentId) return null;
  for (const folder of book.backgroundFolders) {
    const document = folder.documents.find(doc => doc.id === documentId);
    if (document) return document;
  }
  return null;
};

export const getCurrentLocation = (book, locationId) => {
  if (!locationId) return null;
  return book.locations.find(location => location.id === locationId) || null;
};

export const getCurrentFrontMatter = (book, frontMatterId) => {
  if (!frontMatterId) return null;
  return book.frontMatter.find(fm => fm.id === frontMatterId) || null;
};

export const getCurrentBackMatter = (book, backMatterId) => {
  if (!backMatterId || !book.backMatter) return null;
  return book.backMatter.find(bm => bm.id === backMatterId) || null;
};

export const getCurrentIllustration = (book, illustrationId) => {
  if (!illustrationId || !book.illustrations) return null;
  return book.illustrations.find(ill => ill.id === illustrationId) || null;
};
