import { Toaster, Position, Intent, NumericInput } from "@blueprintjs/core";
import cardData from "../cardData";

const logToast = Toaster.create({
  position: Position.TOP_CENTER
});

const isStarter = id => id.includes("opening-");

export const showAction = (cardData, state, action) => {
  switch (action.type) {
    case "BUY_FOOD":
      return `Opponent bought ${
        cardData.food.find(({ id }) => id === action.id).name
      }!`;
    case "ADD_GUEST":
      return `Opponent bought ${
        cardData.guest.find(({ id }) => id === action.id).name
      }!`;
    case "PLAY_CARD":
      const foodName = isStarter(action.id)
        ? cardData.starting.find(({ id }) => id === action.id).name
        : cardData.food.find(({ id }) => id === action.id).name;

      return `Opponent played ${foodName}!`;
    default:
      return null;
  }
};

/**
 * show actions performed by another player.
 * shamelessly side-effectful,
 * but Toast APIs are all stateless :)
 */
export const playLog = store => next => action => {
  if (action.playerId) {
    cardData.then(cardData => {
      const actionMsg = showAction(
        cardData,
        store.getState().gameState,
        action
      );
      if (actionMsg) {
        logToast.show({
          message: actionMsg,
          intent: Intent.WARNING,
          timeout: 2000
        });
      }
    });
  }

  return next(action);
};

export default playLog;
