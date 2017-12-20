import { setAt } from '../array';
import { pick } from '../object';

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
  aura: [],
  prestige: 0,
};

export const discardHand = state => ({
  ...state,
  hand: [],
  discard: [...state.discard, ...state.hand],
});

/**
 * move card from anywhere on the board to a target pile
 */
const moveCard = (state, id, target) => {
  const newState = {};
  for (let loc of [
    'hand',
    'myDeck',
    'discard',
    'foodDeck',
    'guestDeck',
    'guestDiscard',
    'aura',
    'partyPool',
  ]) {
    let sourceCard = state[loc].find(c => c.id == id);
    if (sourceCard) {
      newState[loc] = state[loc].filter(c => c.id != id);
      if (loc == 'partyPool') {
        newState.party = [];
        for (let i = 0; i < 7; i++) {
          newState.party[i] = state.party[i].filter(c => c.id != id);
        }
      }
      if (!state[target].find(c => c.id == id))
        newState[target] = state[target].concat(sourceCard);
    }
  }
  return newState;
}

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

/**
 * elements of state shared by both players
 */
const commonStateKeys = [
  'foodDeck',
  'guestDeck',
  'party',
  'partyPool',
  'guestDiscard',
  'trash',
  'aura',
];

/**
 * defining both self- and other- state keys
 * so that omitting a key from this logic will be more
 * obvious. Safer refactoring absent a type system.
 */
const playerStateKeys = [
  'mana',
  'hand',
  'myDeck',
  'discard',
  'prestige'
]

/**
 * if incoming action isn't me,
 * discard anything that isn't shared.
 * so, eg, ignore .hand if the other player drew a card.
 */
export const routeForOtherPlayer = reducer => (state = baseState, action) => {
  const newState = reducer(state, action);

  const selfView = action.otherPlayer
    ? {
        ...pick(playerStateKeys, state),
        ...pick(commonStateKeys, newState),
      }
    : newState;

  return selfView;
};

export const gameState = routeForOtherPlayer((state = baseState, action) => {
  let card;
  let {
    hand,
    foodDeck,
    partyPool,
    guestDeck,
    guestDiscard,
    party,
    myDeck,
    aura,
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
        for (let i = 0; i < 7; i++) {
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
          partyPool: [...state.partyPool, disCard],
        });
      } else {
        return state;
      }
    case 'END_TURN':
      const prestigeEarned = party.reduce(
        (acc, table) =>
          acc +
          table.reduce((tableTotal, { prestige }) => tableTotal + prestige, 0),
        0,
      );
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
    case 'MOVE_PARTY':
      const partyObj = {};
      partyObj.party = [[], [], [], [], [], [], []];
      partyObj.guestDiscard = state.guestDiscard.slice(0);
      partyObj.partyPool = state.partyPool.slice(0);
      for (let i = 0; i < 7; i++) {
        const newSpot = i + action.num;
        if (newSpot < 0) {
          partyObj.guestDiscard = partyObj.guestDiscard.concat(state.party[i]);
          partyObj.partyPool = partyObj.partyPool.filter(c => !state.party[i].includes(c));
        }
        else if (newSpot >= 7) {
          partyObj.party[6] = partyObj.party[6].concat(state.party[i]);
        }
        else {
          partyObj.party[newSpot] = state.party[i];
        }
      }
      return Object.assign({}, state, partyObj);
    case 'DISCARD_FROM_HAND':
      return Object.assign({}, state, moveCard(state, action.id, "discard"));
    case 'DISCARD_GUEST':
      return Object.assign({}, state, moveCard(state, action.id, "guestDiscard"));
    case 'TRASH_CARD':
      return Object.assign({}, state, moveCard(state, action.id, "trash"));
    case 'SET_AURA':
      return Object.assign({}, state, moveCard(state, action.id, "aura"));
    case 'DRAW_CARD':
      return drawCard(state);
    case 'SHUFFLE':
      const shuffleobj = {};
      shuffleobj[action.deckname] = state[action.deckname].sort(
        () => Math.random() - 0.5,
      );
      return Object.assign({}, state, shuffleobj);
    case 'PLAY_CARD':
      return Object.assign({}, state, moveCard(state, action.id, "discard"));
    case 'SET_PRESTIGE':
      return Object.assign({}, state, { prestige: action.num });
    case 'SET_MANA':
      return Object.assign({}, state, { mana: action.num });
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
});

export default gameState;
