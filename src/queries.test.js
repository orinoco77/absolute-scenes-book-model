import {
  getCurrentScene, getCurrentCharacter, getCurrentDocument,
  getCurrentLocation, getCurrentFrontMatter, getCurrentBackMatter, getCurrentIllustration
} from './queries.js';

const book = {
  chapters: [{ id: 'ch1', title: 'Chapter 1', scenes: [{ id: 's1', title: 'Scene 1' }] }],
  characters: [{ id: 'c1', name: 'Alice' }],
  backgroundFolders: [{ id: 'f1', title: 'Notes', documents: [{ id: 'd1', title: 'Doc 1' }] }],
  locations: [{ id: 'l1', name: 'Castle' }],
  frontMatter: [{ id: 'fm1', type: 'copyright' }],
  backMatter: [{ id: 'bm1', type: 'epilogue' }],
  illustrations: [{ id: 'i1', page: 1 }]
};

test('getCurrentScene finds a scene across chapters, or returns null', () => {
  expect(getCurrentScene(book, 's1')).toEqual({ id: 's1', title: 'Scene 1' });
  expect(getCurrentScene(book, 'missing')).toBeNull();
  expect(getCurrentScene(book, null)).toBeNull();
});

test('getCurrentCharacter finds a character, or returns null', () => {
  expect(getCurrentCharacter(book, 'c1')).toEqual({ id: 'c1', name: 'Alice' });
  expect(getCurrentCharacter(book, 'missing')).toBeNull();
});

test('getCurrentDocument finds a document across folders, or returns null', () => {
  expect(getCurrentDocument(book, 'd1')).toEqual({ id: 'd1', title: 'Doc 1' });
  expect(getCurrentDocument(book, 'missing')).toBeNull();
});

test('getCurrentLocation finds a location, or returns null', () => {
  expect(getCurrentLocation(book, 'l1')).toEqual({ id: 'l1', name: 'Castle' });
  expect(getCurrentLocation(book, 'missing')).toBeNull();
});

test('getCurrentFrontMatter finds a front matter item, or returns null', () => {
  expect(getCurrentFrontMatter(book, 'fm1')).toEqual({ id: 'fm1', type: 'copyright' });
  expect(getCurrentFrontMatter(book, 'missing')).toBeNull();
});

test('getCurrentBackMatter finds a back matter item, or returns null even when backMatter is absent', () => {
  expect(getCurrentBackMatter(book, 'bm1')).toEqual({ id: 'bm1', type: 'epilogue' });
  expect(getCurrentBackMatter({ ...book, backMatter: undefined }, 'bm1')).toBeNull();
});

test('getCurrentIllustration finds an illustration, or returns null even when illustrations is absent', () => {
  expect(getCurrentIllustration(book, 'i1')).toEqual({ id: 'i1', page: 1 });
  expect(getCurrentIllustration({ ...book, illustrations: undefined }, 'i1')).toBeNull();
});
