var React = require('react');
var ReactDOM = require('react-dom');
import App from './components/App';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import feastApp from './reducers';
import io from 'socket.io-client';
import socketLogger from './middleware/socketLogger';

const socket = io();
socket.on('connect', () => console.log('connected'));
socket.on('action', action => {
  console.log('got action', action);
});
socket.open();

let store = createStore(feastApp, applyMiddleware(socketLogger(socket)));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'),
);
