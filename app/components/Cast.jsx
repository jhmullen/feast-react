import React, {Component} from "react";

import "./Cast.css";

export default class Cast extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      mana: 0
    };
  }

  render() {

    const {mana} = this.state;

    return (
      <div id="cast">
        <div id="cast-bg">
        </div>
        <div id="counter">
          { `${mana} mana` }
        </div>
      </div>
    );

  }
}

