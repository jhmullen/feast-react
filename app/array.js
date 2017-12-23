// utils for immutable array updates
export const setAt = (idx, val, array) => [
  ...array.slice(0, idx),
  val,
  ...array.slice(idx + 1),
];

export const updateAt = (idx, fn, array) => setAt(idx, fn(array[idx]), array);

export const pad = (toLen, withWhat, array) => [
  ...array,
  ...Array(withWhat).fill(toLen - array.length),
];
