export const applyMana = num => {
  return {
    type: "APPLY_MANA",
    num: num
  }
}

export const setFaceupFood = faceup_food => {
  return {
    type: "SET_FACEUP_FOOD",
    faceup_food: faceup_food
  }
}

export const setHand = hand => {
  return {
    type: "SET_HAND",
    hand: hand
  }
}