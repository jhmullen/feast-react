import React, {Component} from "react";

import "./App.css";

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }

  render() {

    return (
      <div id="board">
        hi
      </div>
    );

  }
}

