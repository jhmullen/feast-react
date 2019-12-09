var React = require('react');
var ReactDOM = require('react-dom');
import App from './components/App';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import feastApp from './reducers';
import io from 'socket.io-client';
import socketLogger from './middleware/socketLogger';
import playLog from './middleware/playLog';

const socket = io();
socket.on('connect', () => console.log('connected'));

let store = createStore(
  feastApp,
  applyMiddleware(socketLogger(socket), playLog),
);

// Listens to socket actions, i.e., events that the other player emits.
// Upon other player action, call our OWN redux update to keep us up to date.
// A routed playerId has been added to the action from socketLogger.
socket.on('action', action => {
  store.dispatch(action);
});

socket.open();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'),
);
