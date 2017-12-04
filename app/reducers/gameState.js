const baseState = {
  mana: 0,
  hand: [],
  foodDeck: [],
  guestDeck: [],
  myDeck: [],
  discard: [],
}

const gameState = (state = baseState, action) => {
  let card, hand, foodDeck, myDeck, discard;
  switch (action.type) {
    case "APPLY_MANA":
      return Object.assign({}, state, {mana: state.mana + action.num});
    case "BUY_FOOD":
      card = state.foodDeck.find(c => c.id == action.id);
      foodDeck = state.foodDeck.filter(c => c.id != action.id);
      discard = state.discard.concat(card);
      return Object.assign({}, state, {foodDeck, discard});
    case "DRAW_CARD":
      myDeck = state.myDeck;
      discard = state.discard;
      card = state.myDeck.splice(-1);
      hand = state.hand.concat(card);
      if (myDeck.length == 0) {
        myDeck = state.discard;
        discard = []
      }
      return Object.assign({}, state, {hand, myDeck, discard});
    case "PLAY_CARD":
      card = state.hand.find(c => c.id == action.id);
      hand = state.hand.filter(c => c.id != action.id);
      discard = state.discard.concat(card);
      return Object.assign({}, state, {hand, discard});
    case "SET_HAND":
      return Object.assign({}, state, {hand: action.hand})
    case "SET_MY_DECK":
      return Object.assign({}, state, {myDeck: action.myDeck})
    case "SET_FOOD_DECK":
      return Object.assign({}, state, {foodDeck: action.foodDeck})
    default:
      return state
  }
}

export default gameState