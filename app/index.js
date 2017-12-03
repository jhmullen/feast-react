var React = require("react");
var ReactDOM = require("react-dom");
import App from "./components/App";
import {Provider} from "react-redux";
import {createStore} from "redux";
import feastApp from "./reducers";

let store = createStore(feastApp);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);