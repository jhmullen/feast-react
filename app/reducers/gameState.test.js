import { addGuest, buyFood, endTurn } from '../actions';
import {
  gameState as reduce,
  baseState,
  discardHand,
  drawCard,
  drawCards,
} from './gameState';

const card = {
  id: 0,
  cost: 2,
};

/**
 * convenience; make a bunch of cards
 */
const idRange = (min, max) => {
  let i = min;
  let out = [];
  while (i < max) {
    out.push({ id: i });
    i++;
  }
  return out;
};

describe('discardHand', () => {
  test('no cards', () => expect(discardHand(baseState)).toEqual(baseState));
  test('one', () =>
    expect(
      discardHand({
        ...baseState,
        hand: [{ id: 0 }],
      }),
    ).toMatchObject({
      hand: [],
      discard: [{ id: 0 }],
    }));
  test('order maintained', () =>
    expect(
      discardHand({
        ...baseState,
        hand: [{ id: 0 }, { id: 1 }],
        discard: [{ id: 3 }],
      }),
    ).toMatchObject({
      hand: [],
      discard: [{ id: 3 }, { id: 0 }, { id: 1 }],
    }));
});

describe('drawCard', () => {
  test('empty deck', () => expect(drawCard(baseState)).toEqual(baseState));
  test('empty hand', () =>
    expect(
      drawCard({
        ...baseState,
        myDeck: [{ id: 0 }],
      }),
    ).toMatchObject({ ...baseState, myDeck: [], hand: [{ id: 0 }] }));
  test('hand and deck retained', () =>
    expect(
      drawCard({
        ...baseState,
        hand: [{ id: 0 }, { id: 1 }],
        myDeck: [{ id: 2 }, { id: 3 }],
      }),
    ).toMatchObject({
      hand: [{ id: 0 }, { id: 1 }, { id: 3 }],
      myDeck: [{ id: 2 }],
    }));
});

describe('drawCards', () => {
  test('one', () =>
    expect(
      drawCards(1, {
        ...baseState,
        myDeck: [{ id: 0 }],
      }),
    ).toMatchObject({
      hand: [{ id: 0 }],
      myDeck: [],
    }));
  test('cycles discard', () =>
    expect(
      drawCards(1, {
        ...baseState,
        discard: [{ id: 0 }],
      }),
    ).toMatchObject({
      discard: [],
      hand: [{ id: 0 }],
    }));

  test('cuts short. draws deck first. retains hand.', () => {
    const discarded = [1, 2, 3, 4, 5].map(id => ({ id }));
    const inDeck = [6, 7, 8, 9, 10].map(id => ({ id }));
    const inHand = [11, 12, 13, 14].map(id => ({ id }));

    expect(
      drawCards(20, {
        ...baseState,
        discard: discarded,
        myDeck: inDeck,
        hand: inHand,
      }),
    ).toMatchObject({
      hand: [...inHand, ...inDeck.reverse(), ...discarded.reverse()],
    });
  });
});

describe('BUY_FOOD', () => {
  test('insufficient mana is no-op', () => {
    const state = {
      ...baseState,
      mana: 1,
      foodDeck: [card],
    };
    expect(reduce(state, buyFood(0))).toEqual(state);
  });

  test('buy deducts mana', () => {
    const state = {
      ...baseState,
      mana: 2,
      foodDeck: [card],
    };

    expect(reduce(state, buyFood(0))).toMatchObject({
      mana: 0,
      foodDeck: [],
      discard: [card],
    });
  });
});

describe('END_TURN', () => {
  describe('prestige', () => {
    test('none', () => expect(reduce(baseState, endTurn())).toEqual(baseState));
    test('one table', () =>
      expect(
        reduce(
          {
            ...baseState,
            party: [
              [
                {
                  prestige: 1,
                },
              ],
            ],
          },
          endTurn(),
        ),
      ).toMatchObject({ prestige: 1 }));
    test('accumulates', () =>
      expect(
        reduce(
          {
            ...baseState,
            prestige: 1,
            party: [
              [
                {
                  prestige: 1,
                },
              ],
            ],
          },
          endTurn(),
        ),
      ).toMatchObject({ prestige: 2 }));

    test('min prestige is zero', () =>
      expect(
        reduce(
          {
            ...baseState,
            prestige: 1,
            party: [
              [
                {
                  prestige: 1,
                },
              ],
              [],
              [{ prestige: -3 }],
            ],
          },
          endTurn(),
        ),
      ).toMatchObject({ prestige: 0 }));
    test('two tables', () =>
      expect(
        reduce(
          {
            ...baseState,
            party: [
              [
                {
                  prestige: 1,
                },
              ],
              [],
              [{ prestige: 2 }],
            ],
          },
          endTurn(),
        ),
      ).toMatchObject({ prestige: 3 }));

    describe('replenishes hand', () => {
      test('draw five', () =>
        expect(
          reduce(
            {
              ...baseState,
              myDeck: idRange(0, 11),
            },
            endTurn(),
          ),
        ).toMatchObject({
          hand: idRange(6, 11).reverse(),
          myDeck: idRange(0, 6),
        }));
      test('card travels hand -> discard -> deck -> hand if necessary, maintaining order', () => {
        const state = reduce(
          {
            ...baseState,
            myDeck: idRange(0, 2),
            discard: idRange(2, 4),
            hand: idRange(4, 5),
          },
          endTurn(),
        );

        expect(state.myDeck).toHaveLength(0);
        expect(state.discard).toHaveLength(0);
        // shuffling makes the test assertion slightly delicate :)
        // deck drawn first, from top
        expect(state.hand.slice(0, 2)).toEqual([{ id: 1 }, { id: 0 }]);
        // discard drawn in _some_ order,
        // _with_ what was in hand
        expect(
          state.hand.slice(2, 5).sort((a, b) => (a.id < b.id ? -1 : 1)),
        ).toEqual([{ id: 2 }, { id: 3 }, { id: 4 }]);
      });
    });
  });
});

describe('ADD_GUEST', () => {
  test('insufficient mana is no-op', () => {
    const state = {
      ...baseState,
      mana: 1,
      guestDeck: [card],
    };
    expect(reduce(state, addGuest(0, 1))).toEqual(state);
  });

  test('buy deducts mana', () => {
    const state = {
      ...baseState,
      mana: 2,
      guestDeck: [card],
    };

    expect(reduce(state, addGuest(0, 1))).toMatchObject({
      mana: 0,
      guestDeck: [],
    });
  });
});
