import { buyFood } from '../actions';
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
