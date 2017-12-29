// @flow
// utils for immutable array updates
export const setAt = <T>(idx: number, val: T, array: T[]): T[] => [
  ...array.slice(0, idx),
  val,
  ...array.slice(idx + 1),
];

export const updateAt = <T>(idx: number, fn: (t: T) => T, array: T[]): T[] =>
  setAt(idx, fn(array[idx]), array);

export const pad = <T>(toLen: number, withWhat: T, array: T[]): T[] => [
  ...array,
  ...Array(withWhat).fill(toLen - array.length),
];

export const shiftBy = <T>(idx: number, padWith: T, array: T[]): T[] => {
  const clamp = num => Math.max(0, Math.min(array.length, num));
  const start = clamp(0 - idx);
  const end = clamp(array.length - idx);

  return pad(array.length, padWith, array.slice(start, end));
};
