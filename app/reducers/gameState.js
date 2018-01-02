// @flow
import { pad, setAt, updateAt } from '../array';
import { pick } from '../object';

/**
 * how many party tables are there?
 */
const NUM_TABLES = 7;

type Card = {
  cost: number,
  id: string,
  prestige: number,
};

type Player = {
  discard: Card[],
  hand: Card[],
  mana: number,
  myDeck: Card[],
  party: Card[][],
  partyPool: Card[],
  prestige: number,
};

type State = {
  playerId: string,
  players: {
    [string]: Player,
  },
  foodDeck: Card[],
  guestDeck: Card[],
  guestDiscard: Card[],
  aura: Card[],
  trash: Card[],
};

type Action =
  | {|
      type: 'APPLY_MANA',
      num: number,
    |}
  | {|
      type: 'BUY_FOOD',
      id: string,
      playerId: string,
    |}
  | {|
      type: 'PICK_PLAYER',
      id: string,
    |}
  | {|
      type: 'ADD_GUEST',
      id: string,
      spot: number,
      playerId: string,
    |}
  | {| type: 'END_TURN' |}
  | {|
      type: 'MOVE_PARTY',
      num: number,
      playerId: string,
    |}
  | {|
      type: 'DISCARD_GUEST',
      id: string,
    |}
  | {|
      type: 'TRASH_CARD',
      id: string,
    |}
  | {|
      type: 'SET_AURA',
      id: string,
    |}
  | {| type: 'SET_MANA', num: number |}
  | {| type: 'SET_HAND', hand: Card[] |}
  | {| type: 'SET_MY_DECK', myDeck: Card[] |}
  | {|
      type: 'SHUFFLE',
      deckname:
        | 'myDeck'
        | 'aura'
        | 'discard'
        | 'foodDeck'
        | 'guestDeck'
        | 'guestDiscard',
    |}
  | {|
      type: 'SET_FOOD_DECK',
      foodDeck: Card[],
    |}
  | {|
      type: 'SET_GUEST_DECK',
      guestDeck: Card[],
    |}
  | {|
      type: 'DISCARD_FROM_HAND',
      id: string,
      playerId: string,
    |}
  | {|
      type: 'PLAY_CARD',
      id: string,
      playerId: string,
    |}
  | {|
      type: 'DRAW_CARD',
    |}
  | {| type: 'SET_PRESTIGE', num: number |};

type Reducer = (state: State, act: Action) => State;

export const blankPlayer = {
  mana: 100,
  hand: [],
  myDeck: [],
  discard: [],
  party: [[], [], [], [], [], [], []],
  partyPool: [],
  prestige: 0,
};

export const baseState: State = {
  playerId: '',
  players: {
    '1': blankPlayer,
    '2': blankPlayer,
  },
  foodDeck: [],
  guestDeck: [],
  guestDiscard: [],
  trash: [],
  aura: [],
};

export const discardHand = (player: Player) => ({
  ...player,
  hand: [],
  discard: [...player.discard, ...player.hand],
});

/**
 * move card from anywhere on the board to a target player's pile.
 * XXX: for now, valid target piles are 'hand', 'myDeck', 'discard',
 * but not 'party', which requires more info about targeting.
 */
const moveCardToPlayer = (
  state: State,
  cardId: string,
  playerId: string,
  target?: 'hand' | 'myDeck' | 'discard',
): Player => {
  const player = state.players[playerId];

  const card = ['hand', 'myDeck', 'discard'].reduce((acc, loc) => {
    if (acc) {
      return acc;
    }

    return player[loc].find(c => c.id === cardId);
  }, null);

  if (!card) {
    return player;
  }

  const sanitizedParty = {
    ...player,
    // party is special due to being a list of lists
    party: player.party.map(table => table.filter(c => c.id !== cardId)),
  };

  const sanitized = ['hand', 'myDeck', 'discard'].reduce(
    (player_, loc) => ({
      ...player_,
      [loc]: player_[loc].filter(c => c.id !== cardId),
    }),
    sanitizedParty,
  );

  if (!target) {
    return sanitized;
  }

  return {
    ...sanitized,
    partyPool: sanitized.party.reduce((a, b) => a.concat(b), []),
    [target]: sanitized[target].concat(card),
  };
};

/**
 * move card from anywhere on the board to a shared target pile
 */
const moveCard = (
  state,
  id,
  target?: 'foodDeck' | 'guestDeck' | 'guestDiscard' | 'aura' | 'trash',
) => {
  const newState: State = {
    ...state,
    players: state.players,
    foodDeck: [],
    guestDeck: [],
    guestDiscard: [],
    aura: [],
  };
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

export const drawCard = (player: Player) => {
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
export const drawCards = (howMany: number, player: Player) => {
  const available = player.discard.length + player.myDeck.length;

  if (available < 1 || howMany < 1) {
    return player;
  }

  return drawCards(howMany - 1, drawCard(player));
};

/**
 * called twice by state and player reducers :|
 * is a sign that having a separate player reducer probably wasn't super smart
 */
export const moveParty = (
  player: Player,
  shiftBy: number,
): { discarded: Card[], party: Card[][] } => {
  if (shiftBy === 0) {
    return {
      discarded: [],
      party: player.party,
    };
  }

  const padding = pad(Math.abs(shiftBy), [], []);
  const left: Card[][] = shiftBy > 0 ? padding : [];
  const right: Card[][] = shiftBy < 0 ? padding : [];

  const allTables = [...left, ...player.party, ...right];

  // XXX moving right has no defined behavior for guests pushed off the edge, does it?
  // do they just stack up on the highest table?
  if (shiftBy > 0) {
    return {
      discarded: [],
      party: allTables.slice(0, NUM_TABLES),
    };
  }

  const discarded = allTables
    .slice(0, Math.abs(shiftBy))
    .reduce((a, b) => a.concat(b), []);

  const party = allTables.slice(
    Math.abs(shiftBy),
    NUM_TABLES + Math.abs(shiftBy),
  );

  return {
    discarded,
    party,
  };
};

/**
 * if incoming action isn't me,
 * discard anything that isn't shared.
 * so, eg, ignore .hand if the other player drew a card.
 */
export const routeForPlayer = (reducer: Reducer) => (
  state: State = baseState,
  baseAction: Action,
) => {
  const playerId: string = baseAction.playerId || state.playerId;

  // force-cast to Action since spreading union types
  // currently confuses the compiler
  const action = (({
    ...baseAction,
    playerId,
  }: any): Action);

  return {
    ...reducer(state, action),
    players: playerId
      ? {
          ...state.players,
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
const reducePlayer = (state, player, action: Action) => {
  const { party } = player;
  let id = null;
  switch (action.type) {
    case 'APPLY_MANA':
      return { ...player, mana: player.mana + action.num };
    case 'BUY_FOOD':
      id = action.id;
      const card = state.foodDeck.find(c => c.id == id);

      if (!card) {
        return state;
      }

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
      id = action.id;
      const newCard = state.guestDeck.find(c => c && c.id == id);

      if (!newCard) {
        return state;
      }

      const oldCard = player.partyPool.find(c => c && c.id == id);
      const disCard = state.guestDiscard.find(c => c && c.id == id);

      if (newCard.cost > player.mana) {
        return player;
      }

      const foundCard = newCard || oldCard || disCard;

      const filteredParty: Card[][] = party.map(table =>
        table.filter(card => card.id !== id),
      );

      const newTable: Card[] = foundCard
        ? [...filteredParty[action.spot], foundCard]
        : filteredParty[action.spot];

      const newParty: Card[][] = foundCard
        ? setAt(action.spot, newTable, filteredParty)
        : filteredParty;

      return {
        ...player,
        party: newParty,
        partyPool: newParty.reduce((acc, table) => [...acc, ...table], []),
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
      const result = moveParty(player, action.num);

      return {
        ...player,
        party: result.party,
        partyPool: result.party.reduce((acc, table) => [...acc, ...table], []),
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

      if (!(action.deckname === 'myDeck' || action.deckname === 'discard')) {
        return player;
      }

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

export const gameState = routeForPlayer((state = baseState, action: Action) => {
  let card;
  let { foodDeck, guestDeck, guestDiscard, aura } = state;
  // for extracting .id from actions that have it
  let id = null;
  switch (action.type) {
    case 'PICK_PLAYER':
      return {
        ...state,
        playerId: action.id,
      };
    case 'BUY_FOOD':
      id = action.id;
      card = state.foodDeck.find(c => c.id == id);

      if (!card) {
        return state;
      }

      const cost = card.cost;

      if (state.players[action.playerId].mana < cost) {
        return state;
      }

      foodDeck = state.foodDeck.filter(c => c.id != id);
      return {
        ...state,
        foodDeck,
      };
    case 'ADD_GUEST':
      id = action.id;
      const newCard = state.guestDeck.find(c => c && c.id == id);

      if (!newCard) {
        return state;
      }

      if (state.players[action.playerId].mana < newCard.cost) {
        return state;
      }
      const disCard = state.guestDiscard.find(c => c && c.id == id);
      // need ES7 do-expressions stat!
      let newState = state;
      if (newCard) {
        guestDeck = state.guestDeck.filter(c => c.id != id);
        newState = Object.assign({}, state, {
          guestDeck,
        });
      } else if (disCard) {
        guestDiscard = state.guestDiscard.filter(c => c.id != id);
        newState = Object.assign({}, state, {
          guestDiscard,
        });
      }
      return newState;
    case 'MOVE_PARTY':
      const result = moveParty(state.players[action.playerId], action.num);

      return {
        ...state,
        guestDiscard: state.guestDiscard.concat(result.discarded),
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
    case 'SHUFFLE':
      const shuffleobj = {};

      if (
        !(
          action.deckname === 'aura' ||
          action.deckname === 'foodDeck' ||
          action.deckname === 'guestDeck' ||
          action.deckname === 'guestDiscard'
        )
      ) {
        return state;
      }

      shuffleobj[action.deckname] = state[action.deckname].sort(
        () => Math.random() - 0.5,
      );

      return Object.assign({}, state, shuffleobj);
    default:
      return state;
  }
});

export default gameState;
