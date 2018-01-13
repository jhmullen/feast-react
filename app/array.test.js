import { pad, setAt } from './array';

describe('setAt', () => {
  test('first', () => expect(setAt(0, 0, [1, 2, 3])).toEqual([0, 2, 3]));
  test('middle', () => expect(setAt(1, 0, [1, 2, 3])).toEqual([1, 0, 3]));
  test('last', () => expect(setAt(2, 0, [1, 2, 3])).toEqual([1, 2, 0]));
  test('overrun is ok', () =>
    expect(setAt(3, 0, [1, 2, 3])).toEqual([1, 2, 3, 0]));
});

describe('pad', () => {
  test('from empty', () => expect(pad(1, 1, [])).toEqual([1]));
  test('grows', () => expect(pad(2, 1, [0])).toEqual([0, 1]));
  test("doesn't shrink", () => expect(pad(2, 1, [0, 2, 3])).toEqual([0, 2, 3]));
  test('nested', () => expect(pad(2, [], [[]])).toEqual([[], []]));
});
