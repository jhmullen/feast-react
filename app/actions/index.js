export const applyMana = num => {
  return {
    type: "APPLY_MANA",
    num: num
  };
};

export const buyFood = id => {
  return {
    type: "BUY_FOOD",
    id: id
  };
};

export const shuffle = deckname => {
  return {
    type: "SHUFFLE",
    deckname: deckname
  };
};

export const trashCard = id => {
  return {
    type: "TRASH_CARD",
    id: id
  };
};

export const addGuest = (id, spot) => {
  return {
    type: "ADD_GUEST",
    id: id,
    spot: spot
  };
};

export const discardGuest = id => {
  return {
    type: "DISCARD_GUEST",
    id: id
  };
};

export const moveParty = num => {
  return {
    type: "MOVE_PARTY",
    num: num
  };
};

export const endTurn = () => {
  return {
    type: "END_TURN"
  };
};

export const drawCard = () => {
  return {
    type: "DRAW_CARD"
  };
};

export const playCard = id => {
  return {
    type: "PLAY_CARD",
    id: id
  };
};

export const setPrestige = num => {
  return {
    type: "SET_PRESTIGE",
    num: num
  };
};

export const setMana = num => {
  return {
    type: "SET_MANA",
    num: num
  };
};

export const setHand = hand => {
  return {
    type: "SET_HAND",
    hand: hand
  };
};

export const setAura = id => {
  return {
    type: "SET_AURA",
    id: id
  };
};

export const discardFromHand = id => {
  return {
    type: "DISCARD_FROM_HAND",
    id: id
  };
};

export const setFoodDeck = foodDeck => {
  return {
    type: "SET_FOOD_DECK",
    foodDeck: foodDeck
  };
};

export const setGuestDeck = guestDeck => {
  return {
    type: "SET_GUEST_DECK",
    guestDeck: guestDeck
  };
};

export const setMyDeck = myDeck => {
  return {
    type: "SET_MY_DECK",
    myDeck: myDeck
  };
};

export const pickPlayer = id => ({
  type: "PICK_PLAYER",
  id
});
