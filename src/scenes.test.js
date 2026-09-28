import { updateScene, addScene, deleteScene, moveSceneBetweenChapters, reorderScenesInChapter } from './scenes.js';

const baseBook = () => ({
  chapters: [
    {
      id: 'ch1',
      title: 'Chapter 1',
      scenes: [
        { id: 's1', title: 'Scene 1', content: 'Hello', notes: '', created: '2020-01-01T00:00:00.000Z', modified: '2020-01-01T00:00:00.000Z' },
        { id: 's2', title: 'Scene 2', content: 'World', notes: '', created: '2020-01-01T00:00:00.000Z', modified: '2020-01-01T00:00:00.000Z' }
      ]
    },
    { id: 'ch2', title: 'Chapter 2', scenes: [] }
  ],
  metadata: { created: '2020-01-01T00:00:00.000Z', modified: '2020-01-01T00:00:00.000Z' }
});

describe('updateScene', () => {
  test('merges updates into the matching scene and normalizes line endings', () => {
    const result = updateScene(baseBook(), 's1', { content: 'line1\r\nline2' });
    const scene = result.chapters[0].scenes[0];
    expect(scene.content).toBe('line1\nline2');
    expect(scene.title).toBe('Scene 1');
  });

  test('throws when the scene does not exist', () => {
    expect(() => updateScene(baseBook(), 'missing', { content: 'x' })).toThrow('Scene not found: missing');
  });
});

describe('addScene', () => {
  test('appends a new scene to the target chapter', () => {
    const result = addScene(baseBook(), 'ch1');
    const scenes = result.chapters[0].scenes;
    expect(scenes).toHaveLength(3);
    expect(scenes[2].title).toBe('Scene 3');
    expect(scenes[2].content).toBe('');
  });

  test('throws when the chapter does not exist, and generates no id', () => {
    expect(() => addScene(baseBook(), 'missing')).toThrow('Chapter not found: missing');
  });
});

describe('deleteScene', () => {
  test('removes the scene from its chapter', () => {
    const result = deleteScene(baseBook(), 's1');
    expect(result.chapters[0].scenes.map(s => s.id)).toEqual(['s2']);
  });

  test('throws when the scene does not exist', () => {
    expect(() => deleteScene(baseBook(), 'missing')).toThrow('Scene not found: missing');
  });
});

describe('moveSceneBetweenChapters', () => {
  test('moves the scene to the target chapter', () => {
    const result = moveSceneBetweenChapters(baseBook(), 's1', 'ch1', 'ch2');
    expect(result.chapters[0].scenes.map(s => s.id)).toEqual(['s2']);
    expect(result.chapters[1].scenes.map(s => s.id)).toEqual(['s1']);
  });

  test('moving within the same chapter relocates the scene to the end', () => {
    const result = moveSceneBetweenChapters(baseBook(), 's1', 'ch1', 'ch1');
    expect(result.chapters[0].scenes.map(s => s.id)).toEqual(['s2', 's1']);
  });

  test('throws and leaves the book unchanged when the target chapter does not exist', () => {
    const book = baseBook();
    expect(() => moveSceneBetweenChapters(book, 's1', 'ch1', 'missing')).toThrow('Chapter not found: missing');
    expect(book.chapters[0].scenes.map(s => s.id)).toEqual(['s1', 's2']);
  });

  test('throws when the source chapter does not exist', () => {
    expect(() => moveSceneBetweenChapters(baseBook(), 's1', 'missing', 'ch2')).toThrow('Chapter not found: missing');
  });

  test('throws when the scene is not in the source chapter', () => {
    expect(() => moveSceneBetweenChapters(baseBook(), 'missing', 'ch1', 'ch2')).toThrow('Scene not found in chapter ch1: missing');
  });
});

describe('reorderScenesInChapter', () => {
  test('moves a scene to a new position within the chapter', () => {
    const result = reorderScenesInChapter(baseBook(), 'ch1', 0, 1);
    expect(result.chapters[0].scenes.map(s => s.id)).toEqual(['s2', 's1']);
  });

  test('throws when the chapter does not exist', () => {
    expect(() => reorderScenesInChapter(baseBook(), 'missing', 0, 1)).toThrow('Chapter not found: missing');
  });

  test('throws when toIndex is out of range', () => {
    expect(() => reorderScenesInChapter(baseBook(), 'ch1', 0, 5)).toThrow('toIndex out of range: 5');
  });

  test('throws when fromIndex is not an integer', () => {
    expect(() => reorderScenesInChapter(baseBook(), 'ch1', undefined, 1)).toThrow('fromIndex out of range: undefined');
  });
});
