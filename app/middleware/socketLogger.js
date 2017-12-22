export const socketLogger = socket => store => next => action => {
  // XXX: implicitly this is us
  if (action.playerId == null) {
    return next({
      ...action,
      playerId: store.getState().gameState.playerId
    });
  }

  if (action.playerId !== store.getState().gameState.playerId) {
    socket.emit("action", action);
  }

  next(action);
};

export default socketLogger;
