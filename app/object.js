// you know pick!
export const pick = (keys, obj) => (keys || []).reduce(
  (acc, key) => ({
    ...acc,
    [key]: obj[key]
  }),
  {}
)
