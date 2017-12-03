import React, {Component} from "react";
import FoodDeck from "./FoodDeck";
import GuestDeck from "./GuestDeck";

import "./Draw.css";

export default class Draw extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }

  render() {

    return (
      <div id="draw">
        <FoodDeck />
        <GuestDeck />
      </div>
    );

  }
}

