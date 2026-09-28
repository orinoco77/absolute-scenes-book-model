import { addLocation, updateLocation, deleteLocation } from './locations.js';

const baseBook = () => ({
  locations: [{ id: 'l1', name: 'Castle', description: '', type: 'General', icon: '📍', notes: '' }],
  metadata: { created: '2020-01-01T00:00:00.000Z', modified: '2020-01-01T00:00:00.000Z' }
});

test('addLocation appends a location with an auto-numbered name', () => {
  const result = addLocation(baseBook());
  expect(result.locations).toHaveLength(2);
  expect(result.locations[1].name).toBe('Location 2');
  expect(result.locations[1].type).toBe('General');
});

describe('updateLocation', () => {
  test('merges updates and bumps the location modified timestamp', () => {
    const result = updateLocation(baseBook(), 'l1', { name: 'Fortress' });
    expect(result.locations[0].name).toBe('Fortress');
    expect(result.locations[0].modified).toBeDefined();
  });

  test('throws when the location does not exist', () => {
    expect(() => updateLocation(baseBook(), 'missing', { name: 'x' })).toThrow('Location not found: missing');
  });
});

describe('deleteLocation', () => {
  test('removes the location', () => {
    const result = deleteLocation(baseBook(), 'l1');
    expect(result.locations).toEqual([]);
  });

  test('throws when the location does not exist', () => {
    expect(() => deleteLocation(baseBook(), 'missing')).toThrow('Location not found: missing');
  });
});
