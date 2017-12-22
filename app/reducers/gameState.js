import { setAt, updateAt } from '../array';
import { pick } from '../object';

export const blankPlayer = {
  mana: 100,
  hand: [],
  deck: [],
  discard: [],
  party: [[], [], [], [], [], [], []],
  partyPool: [],
  prestige: 0,
};

export const baseState = {
  foodDeck: [],
  guestDeck: [],
  guestDiscard: [],
  trash: [],
  aura: [],
  players: {},
};

export const discardHand = player => ({
  ...player,
  hand: [],
  discard: [...player.discard, ...player.hand],
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
const replenish = player =>
  player.myDeck.length
    ? player
    : {
        ...player,
        myDeck: player.discard.sort(() => Math.random() - 0.5),
        discard: [],
      };

export const drawCard = player => {
  player = replenish(player);
  const deck = player.myDeck;

  let card = deck[deck.length - 1];
  let deckLeft = deck.slice(0, deck.length - 1);

  const hand = card ? player.hand.concat(card) : player.hand;

  return replenish(Object.assign({}, player, { hand, myDeck: deckLeft }));
};

/**
 * try to draw X cards, stopping if there aren't enough in discard
 * or deck.
 * naively recursive; like, how many cards are you drawing?
 */
export const drawCards = (howMany, player) => {
  const available = player.discard.length + player.myDeck.length;

  if (available < 1 || howMany < 1) {
    return player;
  }

  return drawCards(howMany - 1, drawCard(player));
};

/**
 * elements of state shared by both players
 */
const commonStateKeys = [
  'foodDeck',
  'guestDeck',
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
  'party',
  'partyPool',
  'myDeck',
  'discard',
  'prestige',
];

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

const reducePlayer = (state, player, action) => {
  const { party } = player;
  switch (action.type) {
    case 'APPLY_MANA':
      return { mana: player.mana + action.num };
    case 'BUY_FOOD':
      discard = player.discard.concat(card);
      return {
        ...player,
        discard,
        mana: state.mana - cost,
      };

    case 'ADD_GUEST':
      const newCard = state.guestDeck.find(c => c && c.id == action.id);
      const oldCard = player.partyPool.find(c => c && c.id == action.id);

      const newParty = oldCard
        ? updateAt(
            action.spot,
            guests => [...guests, oldCard],
            party.map(table => table.filter(({ id }) => id !== action.id)),
          )
        : party;

      return {
        ...player,
        party: newParty,
        partyPool: [...state.partyPool, newCard],
        mana: state.mana - newCard.cost,
      };
    case 'END_TURN':
      const prestigeEarned = party.reduce(
        (acc, table) =>
          acc +
          table.reduce((tableTotal, { prestige }) => tableTotal + prestige, 0),
        0,
      );

      return drawCards(
        4,
        discardHand({
          ...player,
          prestige: Math.max(0, prestigeEarned + state.prestige),
        }),
      );

    case 'MOVE_PARTY':
      const clamp = num => Math.max(0, Math.min(party.length));
      const start = clamp(0 - action.num);
      const end = clamp(party.length - action.num);
      const movedParty = party.slice(start, end);
      return {
        ...player,
        party: movedParty,
        partyPool: movedParty.reduce((acc, table) => [...acc, ...table], []),
      };
    default:
      return player;
  }
};

export const reduceForPlayer = (state, action) => ({
  ...state,
  players: {
    [action.playerId]: reducePlayer(
      state,
      state.players[action.playerId],
      action,
    ),
  },
});

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
      return reduceForPlayer(state, action);
    case 'BUY_FOOD':
      card = state.foodDeck.find(c => c.id == action.id);

      const cost = card.cost;

      if (state.players[action.playerId].mana < cost) {
        return state;
      }

      foodDeck = state.foodDeck.filter(c => c.id != action.id);
      return reduceForPlayer(
        {
          ...state,
          foodDeck,
        },
        action,
      );
    case 'ADD_GUEST':
      const newCard = state.guestDeck.find(c => c && c.id == action.id);
      if (state.players[action.playerId].mana < newCard.cost) {
        return state;
      }
      const disCard = state.guestDiscard.find(c => c && c.id == action.id);
      // need ES7 do-expressions stat!
      let newState = state;
      if (newCard) {
        guestDeck = state.guestDeck.filter(c => c.id != action.id);
        newState = Object.assign({}, state, {
          guestDeck,
        });
      } else if (oldCard) {
        newState = Object.assign({}, state, { party, guestDeck, partyPool });
      } else if (disCard) {
        guestDiscard = state.guestDiscard.filter(c => c.id != action.id);
        newState = Object.assign({}, state, {
          guestDiscard,
        });
      } 
      return reduceForPlayer(newState, action);
    case 'END_TURN':
      return reduceForPlayer(state, action);
    case 'MOVE_PARTY':
      const partyObj = {};
      partyObj.party = [[], [], [], [], [], [], []];
      partyObj.guestDiscard = state.guestDiscard.slice(0);
      partyObj.partyPool = state.partyPool.slice(0);
      for (let i = 0; i < 7; i++) {
        const newSpot = i + action.num;
        if (newSpot < 0) {
          partyObj.guestDiscard = partyObj.guestDiscard.concat(state.party[i]);
        }
      }
      return reduceForPlayer(Object.assign({}, state, partyObj), action);
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
