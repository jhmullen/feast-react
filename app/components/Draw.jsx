import React, { Component } from "react";
import FoodDeck from "./FoodDeck";
import GuestDeck from "./GuestDeck";

import "./Draw.css";

export default class Draw extends Component {

  render() {
    return (
      <div id="draw">
        <FoodDeck />
        <GuestDeck />
      </div>
    );
  }
}
