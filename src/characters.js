import { newId, now } from './ids.js';

export const addCharacter = book => {
  const newCharacter = {
    id: newId(),
    name: `Character ${book.characters.length + 1}`,
    description: '',
    role: '',
    avatar: '👤',
    notes: '',
    created: now(),
    modified: now()
  };
  return {
    ...book,
    characters: [...book.characters, newCharacter],
    metadata: { ...book.metadata, modified: now() }
  };
};

export const updateCharacter = (book, characterId, updates) => {
  if (!book.characters.some(c => c.id === characterId)) {
    throw new Error(`Character not found: ${characterId}`);
  }
  return {
    ...book,
    characters: book.characters.map(character =>
      character.id === characterId ? { ...character, ...updates, modified: now() } : character
    ),
    metadata: { ...book.metadata, modified: now() }
  };
};

export const deleteCharacter = (book, characterId) => {
  if (!book.characters.some(c => c.id === characterId)) {
    throw new Error(`Character not found: ${characterId}`);
  }
  return {
    ...book,
    characters: book.characters.filter(character => character.id !== characterId),
    metadata: { ...book.metadata, modified: now() }
  };
};
