const gamestate = (state = {mana:0}, action) => {
  switch (action.type) {
    case 'APPLY_MANA':
      return Object.assign({}, state, {mana: state.mana + action.num});
    default:
      return state
  }
}

export default gamestate