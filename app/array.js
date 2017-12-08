// utils for immutable array updates
export const setAt = (idx, val, array) => [
  ...array.slice(0, idx),
  val,
  ...array.slice(idx+1),
]