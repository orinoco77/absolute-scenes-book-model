import { newId, now } from './ids.js';

const findFolder = (book, folderId) => {
  const folder = book.backgroundFolders.find(f => f.id === folderId);
  if (!folder) throw new Error(`Background folder not found: ${folderId}`);
  return folder;
};

const findDocument = (book, documentId) => {
  for (const folder of book.backgroundFolders) {
    const doc = folder.documents.find(d => d.id === documentId);
    if (doc) return doc;
  }
  return null;
};

export const addDocument = (book, folderId) => {
  const folder = findFolder(book, folderId);
  const newDocument = {
    id: newId(),
    title: `Document ${folder.documents.length + 1}`,
    content: '',
    created: now(),
    modified: now()
  };
  return {
    ...book,
    backgroundFolders: book.backgroundFolders.map(f =>
      f.id === folderId ? { ...f, documents: [...f.documents, newDocument] } : f
    ),
    metadata: { ...book.metadata, modified: now() }
  };
};

export const updateDocument = (book, documentId, updates) => {
  if (!findDocument(book, documentId)) throw new Error(`Document not found: ${documentId}`);
  return {
    ...book,
    backgroundFolders: book.backgroundFolders.map(folder => ({
      ...folder,
      documents: folder.documents.map(doc =>
        doc.id === documentId ? { ...doc, ...updates, modified: now() } : doc
      )
    })),
    metadata: { ...book.metadata, modified: now() }
  };
};

export const deleteDocument = (book, documentId) => {
  if (!findDocument(book, documentId)) throw new Error(`Document not found: ${documentId}`);
  return {
    ...book,
    backgroundFolders: book.backgroundFolders.map(folder => ({
      ...folder,
      documents: folder.documents.filter(doc => doc.id !== documentId)
    })),
    metadata: { ...book.metadata, modified: now() }
  };
};

export const addBackgroundFolder = book => {
  const newFolder = {
    id: newId(),
    title: `Folder ${book.backgroundFolders.length + 1}`,
    documents: [],
    created: now(),
    modified: now()
  };
  return {
    ...book,
    backgroundFolders: [...book.backgroundFolders, newFolder],
    metadata: { ...book.metadata, modified: now() }
  };
};

export const updateBackgroundFolder = (book, folderId, updates) => {
  findFolder(book, folderId);
  return {
    ...book,
    backgroundFolders: book.backgroundFolders.map(folder =>
      folder.id === folderId ? { ...folder, ...updates, modified: now() } : folder
    ),
    metadata: { ...book.metadata, modified: now() }
  };
};

export const deleteBackgroundFolder = (book, folderId) => {
  findFolder(book, folderId);
  return {
    ...book,
    backgroundFolders: book.backgroundFolders.filter(folder => folder.id !== folderId),
    metadata: { ...book.metadata, modified: now() }
  };
};
