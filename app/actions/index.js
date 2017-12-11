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

export const moveGuest = (id, spot) => {
  return {
    type: "MOVE_GUEST",
    id: id,
    spot: spot
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

export const setHand = hand => {
  return {
    type: "SET_HAND",
    hand: hand
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
