import { now } from './ids.js';
import { normalizeContent } from './normalizeContent.js';

export const createDefaultBook = () => ({
  title: '',
  author: '',
  frontMatter: [],
  parts: [],
  chapters: [{ id: 'default', title: 'Chapter 1', scenes: [] }],
  backMatter: [],
  illustrations: [],
  characters: [],
  characterDetectionBlacklist: [],
  locations: [],
  backgroundFolders: [{ id: 'default-bg', title: 'General Notes', documents: [] }],
  template: {
    fontFamily: 'Times New Roman',
    fontSize: 12,
    lineHeight: 1.6,
    paragraphStyle: 'indented',
    pageSize: 'letter',
    genre: 'general',
    pageMargins: { top: 1, bottom: 1, inside: 1.25, outside: 1 },
    mirrorMargins: false,
    textAlign: 'justified',
    chapterHeader: {
      style: 'numbered',
      format: 'Chapter {number}',
      fontSize: 18,
      fontWeight: 'bold',
      alignment: 'center',
      pageBreak: true,
      spacing: 2,
      lineBreaksBefore: 3,
      startOnRightPage: false
    },
    runningHeaders: { enabled: false, alignment: 'outside', fontSize: 10, skipChapterPages: true }
  },
  github: { repository: null, lastSyncTime: null, lastSyncedContent: null },
  metadata: { created: now(), modified: now() },
  collaboration: { enabled: false, authors: [], currentAuthor: null }
});

const normalizeBookContent = book => ({
  ...book,
  chapters: (book.chapters || []).map(chapter => ({
    ...chapter,
    scenes: (chapter.scenes || []).map(scene => ({
      ...scene,
      content: normalizeContent(scene.content),
      notes: normalizeContent(scene.notes)
    }))
  })),
  frontMatter: (book.frontMatter || []).map(item => ({ ...item, content: normalizeContent(item.content) })),
  backMatter: (book.backMatter || []).map(item => ({ ...item, content: normalizeContent(item.content) })),
  characters: (book.characters || []).map(char => ({
    ...char,
    description: normalizeContent(char.description),
    notes: normalizeContent(char.notes)
  })),
  locations: (book.locations || []).map(loc => ({ ...loc, description: normalizeContent(loc.description) }))
});

export const recoverBook = recoveredBookData => {
  const migratedBook = { ...recoveredBookData };

  if (migratedBook.scenes && !migratedBook.chapters) {
    migratedBook.chapters = [{ id: 'default', title: 'Chapter 1', scenes: migratedBook.scenes }];
    delete migratedBook.scenes;
  }

  if (!migratedBook.frontMatter) migratedBook.frontMatter = [];
  if (!migratedBook.parts) migratedBook.parts = [];
  if (!migratedBook.characters) migratedBook.characters = [];
  if (!migratedBook.characterDetectionBlacklist) migratedBook.characterDetectionBlacklist = [];
  if (!migratedBook.locations) migratedBook.locations = [];
  if (!migratedBook.backgroundFolders) {
    migratedBook.backgroundFolders = [{ id: 'default-bg', title: 'General Notes', documents: [] }];
  }
  if (!migratedBook.github) {
    migratedBook.github = { repository: null, lastSyncTime: null };
  }

  return normalizeBookContent(migratedBook);
};
