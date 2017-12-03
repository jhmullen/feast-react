import React, {Component} from "react";

import "./FoodDeck.css";

export default class FoodDeck extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }

  render() {

    return (
      <div id="fooddeck">
        fooddeck
      </div>
    );

  }
}

