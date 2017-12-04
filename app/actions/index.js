export const applyMana = num => {
  return {
    type: "APPLY_MANA",
    num: num
  }
}

export const buyFood = id => {
  return {
    type: "BUY_FOOD",
    id: id
  }
}

export const drawCard = () => {
  return {
    type: "DRAW_CARD"
  }
}

export const playCard = id => {
  return {
    type: "PLAY_CARD",
    id: id
  }
}

export const setHand = hand => {
  return {
    type: "SET_HAND",
    hand: hand
  }
}

export const setFoodDeck = foodDeck => {
  return {
    type: "SET_FOOD_DECK",
    foodDeck: foodDeck
  }
}

export const setMyDeck = myDeck => {
  return {
    type: "SET_MY_DECK",
    myDeck: myDeck
  }
}