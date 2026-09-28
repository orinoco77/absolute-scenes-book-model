import { newId, now } from './ids.js';

export const addLocation = book => {
  const newLocation = {
    id: newId(),
    name: `Location ${book.locations.length + 1}`,
    description: '',
    type: 'General',
    icon: '📍',
    notes: '',
    created: now(),
    modified: now()
  };
  return {
    ...book,
    locations: [...book.locations, newLocation],
    metadata: { ...book.metadata, modified: now() }
  };
};

export const updateLocation = (book, locationId, updates) => {
  if (!book.locations.some(l => l.id === locationId)) {
    throw new Error(`Location not found: ${locationId}`);
  }
  return {
    ...book,
    locations: book.locations.map(location =>
      location.id === locationId ? { ...location, ...updates, modified: now() } : location
    ),
    metadata: { ...book.metadata, modified: now() }
  };
};

export const deleteLocation = (book, locationId) => {
  if (!book.locations.some(l => l.id === locationId)) {
    throw new Error(`Location not found: ${locationId}`);
  }
  return {
    ...book,
    locations: book.locations.filter(location => location.id !== locationId),
    metadata: { ...book.metadata, modified: now() }
  };
};
