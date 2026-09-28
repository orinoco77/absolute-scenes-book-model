import { requireValidIndex } from './indexRange.js';

test('passes silently for a valid integer index', () => {
  expect(() => requireValidIndex(0, 3, 'fromIndex')).not.toThrow();
  expect(() => requireValidIndex(2, 3, 'fromIndex')).not.toThrow();
});

test('throws for a negative, out-of-range, or non-integer index', () => {
  expect(() => requireValidIndex(-1, 3, 'fromIndex')).toThrow('fromIndex out of range: -1');
  expect(() => requireValidIndex(3, 3, 'toIndex')).toThrow('toIndex out of range: 3');
  expect(() => requireValidIndex(0.5, 3, 'fromIndex')).toThrow('fromIndex out of range: 0.5');
  expect(() => requireValidIndex(undefined, 3, 'fromIndex')).toThrow('fromIndex out of range: undefined');
  expect(() => requireValidIndex(NaN, 3, 'fromIndex')).toThrow('fromIndex out of range: NaN');
  expect(() => requireValidIndex('1', 3, 'toIndex')).toThrow('toIndex out of range: 1');
});
