import React, { Component } from "react";
import { connect } from "react-redux";
import FoodCard from "./FoodCard";
import { setFaceupFood, setFoodDeck } from "../actions";
import { Position, Button } from "@blueprintjs/core";
import Papa from "papaparse";
import Buy from "./Buy";
import DeckOps from "./DeckOps";
import { food } from "../cardData";
import "./FoodDeck.css";

class FoodDeck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faceup: []
    };
  }

  componentDidMount() {
    food.then(cards =>
      this.props.setFoodDeck(cards.sort(() => Math.random() - 0.5))
    );
  }

  render() {
    const { foodDeck, players, playerId } = this.props.gameState;
    const mana = players[playerId];
    const FACEUP_COUNT = 4;
    const faceup = foodDeck.slice(-FACEUP_COUNT);
    let remaining = foodDeck.length - FACEUP_COUNT;
    if (remaining < 0) remaining = 0;

    const faceupList = faceup.map(c => (
      <FoodCard
        key={c.id}
        dragType="buyCard"
        mana={mana}
        position={Position.RIGHT_TOP}
        {...c}
      />
    ));

    return (
      <div id="fooddeck">
        <div>
          <div style={{ display: "block", marginRight: "10px" }} id="image-bg">
            <DeckOps
              deck={foodDeck}
              position={Position.RIGHT}
              deckname="foodDeck"
              dragType="buyCard"
            />
          </div>
          <div id="counter">{`${remaining} in deck`}</div>
        </div>
        <Buy dragType="buyCard" />
        {faceupList}
      </div>
    );
  }
}

const mapStateToProps = state => ({ gameState: state.gameState });

const mapDispatchToProps = dispatch => ({
  setFoodDeck: foodDeck => dispatch(setFoodDeck(foodDeck))
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true
})(FoodDeck);
