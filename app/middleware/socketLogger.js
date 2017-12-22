export const socketLogger = socket => store => next => action => {
  if (action.playerId == null) {
    const playerId = store.getState().gameState.playerId;

    if (playerId) {
      socket.emit("action", {
        ...action,
        playerId
      });
    }
  }

  next(action);
};

export default socketLogger;
