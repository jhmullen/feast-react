import { setAt } from "./array";

describe("setAt", () => {
  test("first", () => expect(setAt(0, 0, [1, 2, 3])).toEqual([0, 2, 3]));
  test("middle", () => expect(setAt(1, 0, [1, 2, 3])).toEqual([1, 0, 3]));
  test("last", () => expect(setAt(2, 0, [1, 2, 3])).toEqual([1, 2, 0]));
  test("overrun is ok", () =>
    expect(setAt(3, 0, [1, 2, 3])).toEqual([1, 2, 3, 0]));
});
