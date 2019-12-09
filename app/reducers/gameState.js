import { pad, setAt, updateAt } from '../array';
import { pick } from '../object';

/** 
 * Each Player keeps track of his own decks, mana, and prestige
 */
export const blankPlayer = {
  mana: 100,
  hand: [],
  myDeck: [],
  discard: [],
  party: [[], [], [], [], [], [], []],
  partyPool: [],
  prestige: 0,
};

/**
 * A shared state contains each player (and all their personal deck info) 
 * alongside the shared decks.
 */
export const baseState = {
  players: {
    1: blankPlayer,
    2: blankPlayer,
  },
  foodDeck: [],
  guestDeck: [],
  guestDiscard: [],
  trash: [],
  aura: [],
};

export const discardHand = player => ({
  ...player,
  hand: [],
  discard: [...player.discard, ...player.hand],
});

/**
 * move card from anywhere on the board to a target player's pile.
 * XXX: for now, valid target piles are 'hand', 'myDeck', 'discard',
 * but not 'party', which requires more info about targeting.
 */
const moveCardToPlayer = (state, cardId, playerId, target) => {
  const player = {
    ...state.players[playerId],
    // party is special due to being a list of lists
    party: state.players[playerId].party.map(table =>
      table.filter(c => c.id !== cardId),
    ),
  };

  const sanitized = ['hand', 'myDeck', 'discard'].reduce(
    (player_, loc) => ({
      ...player_,
      [loc]: player_[loc].filter(c => c.id !== cardId),
    }),
    player,
  );

  if (!target) {
    return sanitized;
  }

  return {
    ...sanitized,
    partyPool: sanitized.party.reduce((a, b) => a.concat(b), []),
    [target]: sanitized[target].concat(cardId),
  };
};

/**
 * move card from anywhere on the board to a shared target pile
 */
const moveCard = (state, id, target) => {
  const newState = { players: state.players };
  for (let loc of ['foodDeck', 'guestDeck', 'guestDiscard', 'aura']) {
    let sourceCard = state[loc].find(c => c.id == id);
    if (sourceCard) {
      newState[loc] = state[loc].filter(c => c.id != id);
      if (target && !state[target].find(c => c.id == id))
        newState[target] = state[target].concat(sourceCard);
    }
  }

  Object.entries(newState.players).forEach(
    ([playerId, player]) =>
      (newState.players[playerId] = moveCardToPlayer(state, id, playerId)),
  );

  return newState;
};

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
 * if incoming action isn't me,
 * discard anything that isn't shared.
 * so, eg, ignore .hand if the other player drew a card.
 */
export const routeForPlayer = reducer => (state = baseState, baseAction) => {
  // Find out which player is making this action. If playerId came in via the action, 
  // then this is a remote action coming from socket.emit. Otherwise, assume it's "me" 
  // and use the state id (set locally in PICK_PLAYER)
  const playerId = baseAction.playerId || state.playerId;
  // Load an action with the routing for which player did it. This is something of a no-op
  // For a remote action (playerId is already in there) but locally, we must use it
  const action = {
    ...baseAction,
    playerId,
  };

  // Remember, this is just a reducer, so it needs to return a new state.
  return {
    // First, run the reducer we were given, but now with the ROUTED action.
    ...reducer(state, action),
    // After that has been run, we need to update our individual players Array and their view of the world.
    players: playerId
      ? {
          ...state.players,
          // playerId is the player that made this action, extracted above from either the baseAction
          // or the state (me). call reducePlayer with the gameState, that players State, and the (routed) action
          [playerId]: reducePlayer(state, state.players[playerId], action),
        }
      : state.players,
  };
};

/**
 * update a player state for an action.
 * operates in parallel with larger state,
 * so for instance, doesn't know/care whether central food deck was updated.
 * may be rickety; was mostly trying to clear player-specific logic away.
 * perhaps unwise and better restructured as functions called
 * by the reducer.
 */
const reducePlayer = (state, player, action) => {
  const { party } = player;
  switch (action.type) {
    case 'APPLY_MANA':
      return { ...player, mana: player.mana + action.num };
    case 'BUY_FOOD':
      const card = state.foodDeck.find(c => c.id == action.id);

      if (card.cost > player.mana) {
        return player;
      }

      const discard = player.discard.concat(card);
      return {
        ...player,
        discard,
        mana: player.mana - card.cost,
      };
    case 'DRAW_CARD':
      return drawCard(player);
    case 'ADD_GUEST':
      const newCard = state.guestDeck.find(c => c && c.id == action.id);
      const oldCard = player.partyPool.find(c => c && c.id == action.id);
      const disCard = state.guestDiscard.find(c => c && c.id == action.id);

      if (newCard.cost > player.mana) {
        return player;
      }

      const foundCard = newCard || oldCard || disCard;

      const newParty = foundCard
        ? updateAt(
            action.spot,
            guests => [...guests, foundCard],
            party.map(table => table.filter(({ id }) => id !== action.id)),
          )
        : party;

      return {
        ...player,
        party: newParty,
        partyPool: [...player.partyPool, foundCard],
        mana: player.mana - foundCard.cost,
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
          prestige: Math.max(0, prestigeEarned + player.prestige),
        }),
      );

    case 'MOVE_PARTY':
      const clamp = num => Math.max(0, Math.min(party.length, num));
      const start = clamp(0 - action.num);
      const end = clamp(party.length - action.num);
      const movedParty = pad(7, [], party.slice(start, end));
      return {
        ...player,
        party: movedParty,
        partyPool: movedParty.reduce((acc, table) => [...acc, ...table], []),
      };
    case 'SET_PRESTIGE':
      return Object.assign({}, player, { prestige: action.num });
    case 'SET_MANA':
      return Object.assign({}, player, { mana: action.num });
    case 'SET_HAND':
      return Object.assign({}, player, { hand: action.hand });
    case 'SET_MY_DECK':
      return Object.assign({}, player, { myDeck: action.myDeck });
    case 'SHUFFLE':
      const shuffleobj = {};
      shuffleobj[action.deckname] = player[action.deckname].sort(
        () => Math.random() - 0.5,
      );
      return Object.assign({}, player, shuffleobj);
    case 'DISCARD_FROM_HAND':
      return moveCardToPlayer(state, action.id, action.playerId, 'discard');
    case 'PLAY_CARD':
      return moveCardToPlayer(state, action.id, action.playerId, 'discard');
    default:
      return player;
  }
};

/** 
 * Normally a reducer is given a state and an action, goes through case statements, 
 * and returns a new state. However, actions may come in either from the local state (normally)
 * or from the socket (other player). Wrap reducer in a function that figures out WHO is doing
 * the action. Pass that function this reducer. That function then adds a playerId to the action,
 * calls this reducer, THEN updates player state separately.
 */
export const gameState = routeForPlayer((state = baseState, action) => {
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
    case 'PICK_PLAYER':
      return {
        ...state,
        playerId: action.id,
        opponentId: action.id === 1 ? 2 : 1
      };
    case 'BUY_FOOD':
      card = state.foodDeck.find(c => c.id == action.id);

      const cost = card.cost;

      if (state.players[action.playerId].mana < cost) {
        return state;
      }

      foodDeck = state.foodDeck.filter(c => c.id != action.id);
      return {
        ...state,
        foodDeck,
      };
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
      } else if (disCard) {
        guestDiscard = state.guestDiscard.filter(c => c.id != action.id);
        newState = Object.assign({}, state, {
          guestDiscard,
        });
      }
      return newState;
    case 'MOVE_PARTY':
      return {
        ...state,
        guestDiscard: state.guestDiscard.concat(
          state.players[action.playerId].party[0],
        ),
      };
    case 'DISCARD_GUEST':
      return Object.assign(
        {},
        state,
        moveCard(state, action.id, 'guestDiscard'),
      );
    case 'TRASH_CARD':
      return Object.assign({}, state, moveCard(state, action.id, 'trash'));
    case 'SET_AURA':
      return Object.assign({}, state, moveCard(state, action.id, 'aura'));
    case 'SET_FOOD_DECK':
      return Object.assign({}, state, { foodDeck: action.foodDeck });
    case 'SET_GUEST_DECK':
      return Object.assign({}, state, { guestDeck: action.guestDeck });
    case 'DISCARD_FROM_HAND':
      return { ...state, ...moveCard(state, action.id) };
    case 'PLAY_CARD':
      return { ...state, ...moveCard(state, action.id) };
    default:
      return state;
  }
});

export default gameState;
