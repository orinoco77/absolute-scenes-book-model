import { getActiveDraft, listDrafts, getExportBook, createDraft, switchDraft, renameDraft, deleteDraft } from './drafts.js';

const baseBook = () => ({
  chapters: [{ id: 'ch1', title: 'Chapter 1', scenes: [{ id: 's1', title: 'Scene 1', content: 'Hello', notes: '' }] }],
  parts: [],
  metadata: { created: '2020-01-01T00:00:00.000Z', modified: '2020-01-01T00:00:00.000Z' }
});

test('getActiveDraft returns the implicit draft when none is set', () => {
  const draft = getActiveDraft(baseBook());
  expect(draft.id).toBe('default-draft');
  expect(draft.name).toBe('Draft 1');
});

test('listDrafts includes the active draft plus any inactive ones, sorted by created', () => {
  const book = {
    ...baseBook(),
    activeDraft: { id: 'd1', name: 'Draft 1', created: '2020-01-02T00:00:00.000Z' },
    drafts: [{ id: 'd2', name: 'Draft 2', created: '2020-01-01T00:00:00.000Z', chapters: [], parts: [] }]
  };
  const result = listDrafts(book);
  expect(result.map(d => d.id)).toEqual(['d2', 'd1']);
  expect(result.find(d => d.id === 'd1').isActive).toBe(true);
  expect(result.find(d => d.id === 'd2').isActive).toBe(false);
});

describe('getExportBook', () => {
  test('returns the same book reference for the active draft', () => {
    const book = baseBook();
    expect(getExportBook(book, null)).toBe(book);
  });

  test('returns a book with the inactive draft\'s tree substituted in', () => {
    const book = {
      ...baseBook(),
      drafts: [{ id: 'd2', name: 'Draft 2', created: '2020-01-01T00:00:00.000Z', chapters: [{ id: 'ch2', title: 'Other', scenes: [] }], parts: [] }]
    };
    const result = getExportBook(book, 'd2');
    expect(result.chapters).toEqual([{ id: 'ch2', title: 'Other', scenes: [] }]);
  });

  test('throws when the draft does not exist', () => {
    expect(() => getExportBook(baseBook(), 'missing')).toThrow('Draft not found: missing');
  });
});

describe('createDraft', () => {
  test('mode "copy" clones the current chapters and parts with fresh ids and text', () => {
    const result = createDraft(baseBook(), { name: 'My Draft', mode: 'copy' });
    expect(result.drafts).toHaveLength(1);
    const newDraft = result.drafts[result.drafts.length - 1];
    expect(newDraft.name).toBe('My Draft');
    expect(newDraft.chapters[0].scenes[0].content).toBe('Hello');
    expect(newDraft.chapters[0].id).not.toBe('ch1');
    expect(result.activeDraft.id).toBe('default-draft');
  });

  test('mode "empty" clones structure only, with blank scene text', () => {
    const result = createDraft(baseBook(), { name: 'Outline', mode: 'empty' });
    const newDraft = result.drafts[result.drafts.length - 1];
    expect(newDraft.chapters[0].scenes[0].content).toBe('');
  });

  test('mode "blank" starts a fresh single chapter', () => {
    const result = createDraft(baseBook(), { name: 'Fresh Start', mode: 'blank' });
    const newDraft = result.drafts[result.drafts.length - 1];
    expect(newDraft.chapters).toEqual([{ id: newDraft.chapters[0].id, title: 'Chapter 1', scenes: [] }]);
  });

  test('an unnamed draft gets an auto-numbered name', () => {
    const result = createDraft(baseBook(), { name: '', mode: 'blank' });
    expect(result.drafts[0].name).toBe('Draft 2');
  });
});

describe('switchDraft', () => {
  test('parks the active draft and activates the target', () => {
    const book = {
      ...baseBook(),
      drafts: [{ id: 'd2', name: 'Draft 2', created: '2020-01-01T00:00:00.000Z', chapters: [{ id: 'ch2', title: 'Other', scenes: [] }], parts: [] }]
    };
    const result = switchDraft(book, 'd2');
    expect(result.activeDraft.id).toBe('d2');
    expect(result.chapters).toEqual([{ id: 'ch2', title: 'Other', scenes: [] }]);
    expect(result.drafts.find(d => d.id === 'default-draft').chapters).toEqual(book.chapters);
  });

  test('is a no-op when switching to the already-active draft', () => {
    const book = baseBook();
    expect(switchDraft(book, 'default-draft')).toBe(book);
  });

  test('throws when the target draft does not exist', () => {
    expect(() => switchDraft(baseBook(), 'missing')).toThrow('Draft not found: missing');
  });
});

describe('renameDraft', () => {
  test('renames the active draft', () => {
    const result = renameDraft(baseBook(), 'default-draft', 'New Name');
    expect(result.activeDraft.name).toBe('New Name');
  });

  test('renames an inactive draft', () => {
    const book = { ...baseBook(), drafts: [{ id: 'd2', name: 'Old', created: '2020-01-01T00:00:00.000Z', chapters: [], parts: [] }] };
    const result = renameDraft(book, 'd2', 'New Name');
    expect(result.drafts[0].name).toBe('New Name');
  });

  test('throws on a blank name', () => {
    expect(() => renameDraft(baseBook(), 'default-draft', '   ')).toThrow('Draft name cannot be empty');
  });

  test('throws when the draft does not exist', () => {
    expect(() => renameDraft(baseBook(), 'missing', 'New Name')).toThrow('Draft not found: missing');
  });
});

describe('deleteDraft', () => {
  test('removes an inactive draft', () => {
    const book = { ...baseBook(), drafts: [{ id: 'd2', name: 'Draft 2', created: '2020-01-01T00:00:00.000Z', chapters: [], parts: [] }] };
    const result = deleteDraft(book, 'd2');
    expect(result.drafts).toEqual([]);
  });

  test('throws when deleting the active draft', () => {
    expect(() => deleteDraft(baseBook(), 'default-draft')).toThrow('Cannot delete the active draft');
  });

  test('throws when the draft does not exist', () => {
    expect(() => deleteDraft(baseBook(), 'missing')).toThrow('Draft not found');
  });
});
