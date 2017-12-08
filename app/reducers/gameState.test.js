import { buyFood, endTurn } from '../actions';
import { gameState as reduce, baseState } from './gameState';

const card = {
  id: 0,
  cost: 2,
};

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
      ).toMatchObject({ prestige: 1 }))
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
  });
});
