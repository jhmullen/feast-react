import * as rawActions from "../actions";
import {
  gameState as reduce,
  baseState,
  blankPlayer,
  discardHand,
  drawCard,
  drawCards
} from "./gameState";

const card = {
  id: 0,
  cost: 2
};

/**
 * for convenience, make all actions act like one player
 * for purposes of testing these reducers
 */
const { addGuest, buyFood, endTurn } = Object.entries(rawActions)
  .map(([k, fn]) => [
    k,
    (...args) => ({
      ...fn(...args),
      playerId: 1
    })
  ])
  .reduce(
    (acc, [k, v]) => ({
      ...acc,
      [k]: v
    }),
    {}
  );

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

describe("discardHand", () => {
  test("no cards", () => expect(discardHand(blankPlayer)).toEqual(blankPlayer));
  test("one", () =>
    expect(
      discardHand({
        ...blankPlayer,
        hand: [{ id: 0 }]
      })
    ).toMatchObject({
      hand: [],
      discard: [{ id: 0 }]
    }));
  test("order maintained", () =>
    expect(
      discardHand({
        ...blankPlayer,
        hand: [{ id: 0 }, { id: 1 }],
        discard: [{ id: 3 }]
      })
    ).toMatchObject({
      hand: [],
      discard: [{ id: 3 }, { id: 0 }, { id: 1 }]
    }));
});

describe("drawCard", () => {
  test("empty deck", () => expect(drawCard(blankPlayer)).toEqual(blankPlayer));
  test("empty hand", () =>
    expect(
      drawCard({
        ...blankPlayer,
        myDeck: [{ id: 0 }]
      })
    ).toMatchObject({ ...blankPlayer, myDeck: [], hand: [{ id: 0 }] }));
  test("hand and deck retained", () =>
    expect(
      drawCard({
        ...blankPlayer,
        hand: [{ id: 0 }, { id: 1 }],
        myDeck: [{ id: 2 }, { id: 3 }]
      })
    ).toMatchObject({
      hand: [{ id: 0 }, { id: 1 }, { id: 3 }],
      myDeck: [{ id: 2 }]
    }));
});

describe("drawCards", () => {
  test("one", () =>
    expect(
      drawCards(1, {
        ...blankPlayer,
        myDeck: [{ id: 0 }]
      })
    ).toMatchObject({
      hand: [{ id: 0 }],
      myDeck: []
    }));
  test("cycles discard", () =>
    expect(
      drawCards(1, {
        ...blankPlayer,
        discard: [{ id: 0 }]
      })
    ).toMatchObject({
      discard: [],
      hand: [{ id: 0 }]
    }));

  test("cuts short. draws deck first. retains hand.", () => {
    const discarded = [1, 2, 3, 4, 5].map(id => ({ id }));
    const inDeck = [6, 7, 8, 9, 10].map(id => ({ id }));
    const inHand = [11, 12, 13, 14].map(id => ({ id }));

    expect(
      drawCards(20, {
        ...baseState,
        discard: discarded,
        myDeck: inDeck,
        hand: inHand
      })
    ).toMatchObject({
      hand: [...inHand, ...inDeck.reverse(), ...discarded.reverse()]
    });
  });
});

describe("BUY_FOOD", () => {
  test("insufficient mana is no-op", () => {
    const state = {
      ...baseState,
      foodDeck: [card],
      players: {
        1: {
          ...blankPlayer,
          mana: 1
        }
      }
    };
    expect(reduce(state, buyFood(0))).toEqual(state);
  });

  test("buy deducts mana", () => {
    const state = {
      ...baseState,
      foodDeck: [card],
      players: {
        1: {
          ...blankPlayer,
          mana: 2
        }
      }
    };

    expect(reduce(state, buyFood(0))).toMatchObject({
      foodDeck: [],
      players: {
        1: {
          mana: 0,
          discard: [card]
        }
      }
    });
  });
});

describe("END_TURN", () => {
  describe("prestige", () => {
    test("none", () =>
      expect(
        reduce(
          {
            ...baseState,
            players: {
              1: blankPlayer
            }
          },
          endTurn()
        )
      ).toEqual({
        ...baseState,
        players: {
          1: blankPlayer
        }
      }));
    test("one table", () =>
      expect(
        reduce(
          {
            ...baseState,
            players: {
              1: {
                ...blankPlayer,
                party: [
                  [
                    {
                      prestige: 1
                    }
                  ]
                ]
              }
            }
          },
          endTurn()
        )
      ).toMatchObject({ players: { 1: { prestige: 1 } } }));

    test("accumulates", () =>
      expect(
        reduce(
          {
            ...baseState,
            players: {
              1: {
                ...blankPlayer,
                prestige: 1,
                party: [
                  [
                    {
                      prestige: 1
                    }
                  ]
                ]
              }
            }
          },
          endTurn()
        )
      ).toMatchObject({ players: { 1: { prestige: 2 } } }));

    test("min prestige is zero", () =>
      expect(
        reduce(
          {
            ...baseState,
            players: {
              1: {
                ...blankPlayer,
                prestige: 1,
                party: [
                  [
                    {
                      prestige: 1
                    }
                  ],
                  [],
                  [{ prestige: -3 }]
                ]
              }
            }
          },
          endTurn()
        )
      ).toMatchObject({ players: { 1: { prestige: 0 } } }));

    test("two tables", () =>
      expect(
        reduce(
          {
            ...baseState,
            players: {
              1: {
                ...blankPlayer,
                party: [
                  [
                    {
                      prestige: 1
                    }
                  ],
                  [],
                  [{ prestige: 2 }]
                ]
              }
            }
          },
          endTurn()
        )
      ).toMatchObject({ players: { 1: { prestige: 3 } } }));

    describe("replenishes hand", () => {
      test("draw a full hand", () =>
        expect(
          reduce(
            {
              ...baseState,
              players: {
                1: {
                  ...blankPlayer,
                  myDeck: idRange(0, 10)
                }
              }
            },
            endTurn()
          )
        ).toMatchObject({
          players: {
            1: {
              hand: idRange(6, 10).reverse(),
              myDeck: idRange(0, 6)
            }
          }
        }));

      test("card travels hand -> discard -> deck -> hand if necessary, maintaining order", () => {
        const state = reduce(
          {
            ...baseState,
            players: {
              1: {
                ...blankPlayer,
                myDeck: idRange(0, 2),
                discard: idRange(2, 3),
                hand: idRange(3, 4)
              }
            }
          },
          endTurn()
        );

        expect(state.players[1].myDeck).toHaveLength(0);
        expect(state.players[1].discard).toHaveLength(0);
        // shuffling makes the test assertion slightly delicate :)
        // deck drawn first, from top
        expect(state.players[1].hand.slice(0, 2)).toEqual([
          { id: 1 },
          { id: 0 }
        ]);
        // discard drawn in _some_ order,
        // _with_ what was in hand
        expect(
          state.players[1].hand
            .slice(2, 5)
            .sort((a, b) => (a.id < b.id ? -1 : 1))
        ).toEqual([{ id: 2 }, { id: 3 }]);
      });
    });
  });
});

describe("ADD_GUEST", () => {
  test("insufficient mana is no-op", () => {
    const state = {
      ...baseState,
      guestDeck: [card],
      players: {
        1: {
          ...blankPlayer,
          mana: 1
        }
      }
    };
    expect(reduce(state, addGuest(0, 1))).toEqual(state);
  });

  test("buy deducts mana", () => {
    const state = {
      ...baseState,
      guestDeck: [card],
      players: {
        1: {
          ...blankPlayer,
          mana: 2
        }
      }
    };

    expect(reduce(state, addGuest(0, 1))).toMatchObject({
      guestDeck: [],
      players: {
        1: {
          mana: 0
        }
      }
    });
  });
});
