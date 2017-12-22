import { Toaster, Position, Intent, NumericInput } from "@blueprintjs/core";
import cardData from "../cardData";

const logToast = Toaster.create({
  position: Position.TOP_CENTER
});

const starter = /starter/;

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
      const foodName = starter.test(action.id)
        ? "Starter"
        : cardData.food.find(({ id }) => id === action.id).name;

      return `Opponent played ${foodName}`;
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
  if (action.playerId !== store.getState().gameState.playerId) {
    cardData.then(cardData => {
      const actionMsg = showAction(
        cardData,
        store.getState().gameState,
        action
      );
      if (actionMsg) {
        logToast.show({
          message: actionMsg,
          intent: Intent.DANGER,
          timeout: 1000
        });
      }
    });
  }

  return next(action);
};

export default playLog;
