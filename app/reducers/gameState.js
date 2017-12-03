const baseState = {
  mana: 0,
  faceup_food: [],
  hand: []
}

const gameState = (state = baseState, action) => {
  switch (action.type) {
    case "APPLY_MANA":
      return Object.assign({}, state, {mana: state.mana + action.num});
    case "SET_FACEUP_FOOD":
      return Object.assign({}, state, {faceup_food: action.faceup_food});
    case "SET_HAND":
      return Object.assign({}, state, {hand: action.hand})
    default:
      return state
  }
}

export default gameState