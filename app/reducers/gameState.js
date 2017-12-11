import { setAt } from '../array';

export const baseState = {
  mana: 100,
  hand: [],
  foodDeck: [],
  guestDeck: [],
  myDeck: [],
  discard: [],
  party: [[], [], [], [], [], [], []],
  partyPool: [],
  guestDiscard: [],
  trash: [],
  prestige: 0,
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
    trash,
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
      const disCard = state.guestDiscard.find(c => c && c.id == action.id);
      if (newCard) {
        if (state.mana < newCard.cost) {
          return state;
        }
        guestDeck = state.guestDeck.filter(c => c.id != action.id);
        return Object.assign({}, state, {
          party: setAt(action.spot, [...party[action.spot], newCard], party),
          guestDeck,
          partyPool: [...state.partyPool, newCard],
          mana: state.mana - newCard.cost,
        });
      } else if (oldCard) {
        for (let i = 0; i <= 7; i++) {
          if (party[i])
            party[i] = state.party[i].filter(c => c && c.id != action.id);
        }
        party[action.spot].push(oldCard);
        return Object.assign({}, state, { party, guestDeck, partyPool });
      } else if (disCard) {
        guestDiscard = state.guestDiscard.filter(c => c.id != action.id);
        return Object.assign({}, state, {
          party: setAt(action.spot, [...party[action.spot], disCard], party),
          guestDiscard,
          partyPool: [...state.partyPool, disCard]
        });
      }
      else {
        return state;
      }
    case 'END_TURN':
      const prestigeEarned = party.reduce(
        (acc, table) =>
          acc +
          table.reduce((tableTotal, { prestige }) => tableTotal + prestige, 0),
        0,
      );
      const leaving = party.shift();
      guestDiscard = state.guestDiscard.concat(leaving);
      party[6] = [];
      partyPool = partyPool.filter(c => !leaving.includes(c));
      return drawCards(
        4,
        discardHand(
          Object.assign({}, state, {
            party,
            guestDiscard,
            partyPool,
            prestige: Math.max(0, prestigeEarned + state.prestige),
          }),
        ),
      );
    case 'MOVE_GUEST':
      card = state.party.find(c => c && c.id == action.id);
      party[action.spot].push(card);
      return Object.assign({}, state, { party });
    case 'TRASH_CARD': 
      const obj = {};
      for (let loc of ["hand", "myDeck", "discard", "foodDeck", "guestDeck", "guestDiscard", "partyPool"]) {
        let tCard = state[loc].find(c => c.id == action.id);
        if (tCard) {
          obj[loc] = state[loc].filter(c => c.id != action.id);
          if (loc == "partyPool") {
            obj.party = [];
            for (let i = 0; i < 7; i++) {
              obj.party[i] = state.party[i].filter(c => c.id != action.id);
            }
          }       
          if (!state.trash.find(c => c.id == action.id)) obj.trash = state.trash.concat(tCard);
        }
      }
      return Object.assign({}, state, obj);
    case 'DRAW_CARD':
      return drawCard(state);
    case 'SHUFFLE':
      const shuffleobj = {};
      shuffleobj[action.deckname] = state[action.deckname].sort(() => Math.random() - 0.5);
      return Object.assign({}, state, shuffleobj);
    case 'PLAY_CARD':
      const playObj = {};
      for (let loc of ["hand", "myDeck", "foodDeck"]) {
        let pCard = state[loc].find(c => c.id == action.id);
        if (pCard) {
          playObj[loc] = state[loc].filter(c => c.id != action.id)
          playObj.discard = state.discard.concat(pCard);
        }
      }
      return Object.assign({}, state, playObj);
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
