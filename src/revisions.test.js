import { getRevisionInfo, createRevision, switchRevision, renameRevision, deleteRevision } from './revisions.js';

const baseScene = () => ({
  id: 's1',
  content: 'Active text',
  created: '2020-01-01T00:00:00.000Z',
  activeRevision: { id: 's1-rev1', label: 'Revision 1', created: '2020-01-01T00:00:00.000Z' },
  revisions: [{ id: 'rev2', label: 'Revision 2', created: '2020-01-02T00:00:00.000Z', content: 'Old text' }]
});

test('getRevisionInfo lists the active revision first, then inactive ones', () => {
  const info = getRevisionInfo(baseScene());
  expect(info.activeId).toBe('s1-rev1');
  expect(info.total).toBe(2);
  expect(info.revisions.map(r => r.id)).toEqual(['s1-rev1', 'rev2']);
  expect(info.revisions[0].isActive).toBe(true);
});

test('getRevisionInfo synthesizes an active revision when the scene has none yet', () => {
  const scene = { id: 's2', content: 'Text', created: '2020-01-01T00:00:00.000Z' };
  const info = getRevisionInfo(scene);
  expect(info.activeId).toBe('s2-rev1');
  expect(info.total).toBe(1);
});

describe('createRevision', () => {
  test('activate: true snapshots the current active revision and makes a fresh one active', () => {
    const result = createRevision(baseScene(), { label: 'Revision 3', mode: 'copy', activate: true });
    expect(result.content).toBe('Active text');
    expect(result.activeRevision.label).toBe('Revision 3');
    expect(result.revisions.find(r => r.id === 's1-rev1').content).toBe('Active text');
  });

  test('activate: false appends an inactive revision without changing the active one', () => {
    const result = createRevision(baseScene(), { label: 'Draft idea', mode: 'copy', activate: false });
    expect(result.content).toBe('Active text');
    expect(result.activeRevision.id).toBe('s1-rev1');
    expect(result.revisions.some(r => r.label === 'Draft idea')).toBe(true);
  });

  test('mode other than "copy" starts the new revision blank', () => {
    const result = createRevision(baseScene(), { label: 'Fresh', mode: 'blank', activate: true });
    expect(result.content).toBe('');
  });
});

describe('switchRevision', () => {
  test('swaps content with the target revision and parks the previously-active one', () => {
    const result = switchRevision(baseScene(), 'rev2');
    expect(result.content).toBe('Old text');
    expect(result.activeRevision.id).toBe('rev2');
    expect(result.revisions.find(r => r.id === 's1-rev1').content).toBe('Active text');
  });

  test('is a no-op when switching to the already-active revision', () => {
    const scene = baseScene();
    expect(switchRevision(scene, 's1-rev1')).toBe(scene);
  });

  test('throws when the target revision does not exist', () => {
    expect(() => switchRevision(baseScene(), 'missing')).toThrow('Revision not found: missing');
  });
});

describe('renameRevision', () => {
  test('renames the active revision', () => {
    const result = renameRevision(baseScene(), 's1-rev1', 'Renamed');
    expect(result.activeRevision.label).toBe('Renamed');
  });

  test('renames an inactive revision', () => {
    const result = renameRevision(baseScene(), 'rev2', 'Renamed');
    expect(result.revisions[0].label).toBe('Renamed');
  });

  test('throws on a blank label', () => {
    expect(() => renameRevision(baseScene(), 's1-rev1', '   ')).toThrow('Revision label cannot be empty');
  });

  test('throws when the revision does not exist', () => {
    expect(() => renameRevision(baseScene(), 'missing', 'Renamed')).toThrow('Revision not found: missing');
  });
});

describe('deleteRevision', () => {
  test('removes an inactive revision', () => {
    const result = deleteRevision(baseScene(), 'rev2');
    expect(result.revisions).toEqual([]);
  });

  test('throws when deleting the active revision', () => {
    expect(() => deleteRevision(baseScene(), 's1-rev1')).toThrow('Cannot delete the active revision');
  });

  test('throws when the revision does not exist', () => {
    expect(() => deleteRevision(baseScene(), 'missing')).toThrow('Revision not found');
  });
});
