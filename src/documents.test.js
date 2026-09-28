import {
  addDocument, updateDocument, deleteDocument,
  addBackgroundFolder, updateBackgroundFolder, deleteBackgroundFolder
} from './documents.js';

const baseBook = () => ({
  backgroundFolders: [
    { id: 'f1', title: 'General Notes', documents: [{ id: 'd1', title: 'Doc 1', content: 'x' }] },
    { id: 'f2', title: 'Research', documents: [] }
  ],
  metadata: { created: '2020-01-01T00:00:00.000Z', modified: '2020-01-01T00:00:00.000Z' }
});

describe('addDocument', () => {
  test('appends a document with an auto-numbered title to the target folder', () => {
    const result = addDocument(baseBook(), 'f1');
    const docs = result.backgroundFolders[0].documents;
    expect(docs).toHaveLength(2);
    expect(docs[1].title).toBe('Document 2');
  });

  test('throws when the folder does not exist', () => {
    expect(() => addDocument(baseBook(), 'missing')).toThrow('Background folder not found: missing');
  });
});

describe('updateDocument', () => {
  test('merges updates into the matching document, wherever its folder is', () => {
    const result = updateDocument(baseBook(), 'd1', { title: 'Renamed' });
    expect(result.backgroundFolders[0].documents[0].title).toBe('Renamed');
  });

  test('throws when the document does not exist', () => {
    expect(() => updateDocument(baseBook(), 'missing', { title: 'x' })).toThrow('Document not found: missing');
  });
});

describe('deleteDocument', () => {
  test('removes the document from its folder', () => {
    const result = deleteDocument(baseBook(), 'd1');
    expect(result.backgroundFolders[0].documents).toEqual([]);
  });

  test('throws when the document does not exist', () => {
    expect(() => deleteDocument(baseBook(), 'missing')).toThrow('Document not found: missing');
  });
});

describe('addBackgroundFolder', () => {
  test('appends a folder with an auto-numbered title', () => {
    const result = addBackgroundFolder(baseBook());
    expect(result.backgroundFolders).toHaveLength(3);
    expect(result.backgroundFolders[2].title).toBe('Folder 3');
    expect(result.backgroundFolders[2].documents).toEqual([]);
  });
});

describe('updateBackgroundFolder', () => {
  test('merges updates into the matching folder', () => {
    const result = updateBackgroundFolder(baseBook(), 'f1', { title: 'Renamed' });
    expect(result.backgroundFolders[0].title).toBe('Renamed');
  });

  test('throws when the folder does not exist', () => {
    expect(() => updateBackgroundFolder(baseBook(), 'missing', { title: 'x' })).toThrow('Background folder not found: missing');
  });
});

describe('deleteBackgroundFolder', () => {
  test('removes the folder', () => {
    const result = deleteBackgroundFolder(baseBook(), 'f2');
    expect(result.backgroundFolders.map(f => f.id)).toEqual(['f1']);
  });

  test('throws when the folder does not exist', () => {
    expect(() => deleteBackgroundFolder(baseBook(), 'missing')).toThrow('Background folder not found: missing');
  });
});
