export const socketLogger = socket => store => next => action => {
  if (!action.otherPlayer) {
    socket.emit('action', action);
  }
  next(action);
};

export default socketLogger;
