// @flow
// utils for immutable array updates
export const setAt = <T>(idx: number, val: T, array: T[]): T[] => [
  ...array.slice(0, idx),
  val,
  ...array.slice(idx + 1),
];

export const updateAt = <T>(idx: number, fn: (t: T) => T, array: T[]): T[] =>
  setAt(idx, fn(array[idx]), array);

export const pad = <T>(toLen: number, withWhat: T, array: T[]): T[] => {
  if (toLen <= array.length) {
    return array;
  }

  return [...array, ...Array(toLen - array.length).fill(withWhat)];
};
