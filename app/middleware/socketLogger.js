export const socketLogger = socket => store => next => action => {
  socket.emit('action', JSON.stringify(action))
  next(action)
}
export default socketLogger