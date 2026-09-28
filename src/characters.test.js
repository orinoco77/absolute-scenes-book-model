import { addCharacter, updateCharacter, deleteCharacter } from './characters.js';

const baseBook = () => ({
  characters: [{ id: 'c1', name: 'Alice', description: '', role: '', avatar: '👤', notes: '' }],
  metadata: { created: '2020-01-01T00:00:00.000Z', modified: '2020-01-01T00:00:00.000Z' }
});

test('addCharacter appends a character with an auto-numbered name', () => {
  const result = addCharacter(baseBook());
  expect(result.characters).toHaveLength(2);
  expect(result.characters[1].name).toBe('Character 2');
  expect(result.characters[1].avatar).toBe('👤');
});

describe('updateCharacter', () => {
  test('merges updates and bumps the character modified timestamp', () => {
    const result = updateCharacter(baseBook(), 'c1', { name: 'Alicia' });
    expect(result.characters[0].name).toBe('Alicia');
    expect(result.characters[0].modified).toBeDefined();
  });

  test('throws when the character does not exist', () => {
    expect(() => updateCharacter(baseBook(), 'missing', { name: 'x' })).toThrow('Character not found: missing');
  });
});

describe('deleteCharacter', () => {
  test('removes the character', () => {
    const result = deleteCharacter(baseBook(), 'c1');
    expect(result.characters).toEqual([]);
  });

  test('throws when the character does not exist', () => {
    expect(() => deleteCharacter(baseBook(), 'missing')).toThrow('Character not found: missing');
  });
});
