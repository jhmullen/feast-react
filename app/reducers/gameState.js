export const baseState = {
  mana: 0,
  hand: [],
  foodDeck: [],
  guestDeck: [],
  myDeck: [],
  discard: [],
  party: [[], [], [], [], [], []],
  partyPool: [],
  guestDiscard: [],
};

export const discardHand = state => ({
  ...state,
  hand: [],
  discard: [...state.discard, ...state.hand],
});

/**
 * move discard to deck if deck is empty
 */
const replenish = state =>
  state.myDeck.length
    ? state
    : {
        ...state,
        myDeck: state.discard.sort(() => Math.random() - 0.5),
        discard: [],
      };

export const drawCard = state => {
  state = replenish(state);
  const deck = state.myDeck;

  let card = deck[deck.length - 1];
  let deckLeft = deck.slice(0, deck.length - 1);

  const hand = card ? state.hand.concat(card) : state.hand;

  return replenish(Object.assign({}, state, { hand, myDeck: deckLeft }));
};

/**
 * try to draw X cards, stopping if there aren't enough in discard
 * or deck.
 * naively recursive; like, how many cards are you drawing?
 */
export const drawCards = (howMany, state) => {
  const available = state.discard.length + state.myDeck.length;

  if (available < 1 || howMany < 1) {
    return state;
  }

  return drawCards(howMany - 1, drawCard(state));
};

export const gameState = (state = baseState, action) => {
  let card;
  let {
    hand,
    foodDeck,
    partyPool,
    guestDeck,
    guestDiscard,
    party,
    myDeck,
    discard,
  } = state;
  switch (action.type) {
    case 'APPLY_MANA':
      return Object.assign({}, state, { mana: state.mana + action.num });
    case 'BUY_FOOD':
      card = state.foodDeck.find(c => c.id == action.id);

      const cost = card.cost;

      if (state.mana < cost) {
        return state;
      }

      foodDeck = state.foodDeck.filter(c => c.id != action.id);
      discard = state.discard.concat(card);
      return Object.assign({}, state, {
        foodDeck,
        discard,
        mana: state.mana - cost,
      });
    case 'ADD_GUEST':
      const newCard = state.guestDeck.find(c => c && c.id == action.id);
      const oldCard = state.partyPool.find(c => c && c.id == action.id);
      if (newCard) {
        guestDeck = state.guestDeck.filter(c => c.id != action.id);
        party[action.spot].push(newCard);
        partyPool.push(newCard);
        return Object.assign({}, state, { party, guestDeck, partyPool });
      } else if (oldCard) {
        for (let i = 0; i <= 6; i++) {
          if (party[i])
            party[i] = state.party[i].filter(c => c && c.id != action.id);
        }
        party[action.spot].push(oldCard);
        return Object.assign({}, state, { party, guestDeck, partyPool });
      } else {
        return state;
      }
    case 'END_TURN':
      const leaving = party.shift();
      guestDiscard = state.guestDiscard.concat(leaving);
      party[5] = [];
      partyPool.filter(c => !leaving.includes(c));
      return drawCards(5, discardHand(Object.assign({}, state, { party, guestDiscard, partyPool })));
    case 'MOVE_GUEST':
      card = state.party.find(c => c && c.id == action.id);
      party[action.spot].push(card);
      return Object.assign({}, state, { party });
    case 'DRAW_CARD':
      return drawCard(state);
    case 'PLAY_CARD':
      myDeck = state.myDeck;
      card = state.hand.find(c => c.id == action.id);
      hand = state.hand.filter(c => c.id != action.id);
      discard = state.discard.concat(card);
      if (state.myDeck.length == 0) {
        myDeck = discard;
        discard = [];
      }
      return Object.assign({}, state, { hand, myDeck, discard });
    case 'SET_HAND':
      return Object.assign({}, state, { hand: action.hand });
    case 'SET_MY_DECK':
      return Object.assign({}, state, { myDeck: action.myDeck });
    case 'SET_FOOD_DECK':
      return Object.assign({}, state, { foodDeck: action.foodDeck });
    case 'SET_GUEST_DECK':
      return Object.assign({}, state, { guestDeck: action.guestDeck });
    default:
      return state;
  }
};

export default gameState;
