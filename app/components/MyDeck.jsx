import React, { Component } from "react";
import { connect } from "react-redux";
import { setMyDeck, drawCard } from "../actions";
import DeckOps from "./DeckOps";
import { Button, Position } from "@blueprintjs/core";
import { starting } from '../cardData';

import "./MyDeck.css";

class MyDeck extends Component {

  componentDidMount() {
    const OPENING_HAND_SIZE = 4;
    starting.then(cards => {
      this.props.setMyDeck(cards.sort(() => Math.random() - 0.5));
      for (let c = 0; c < OPENING_HAND_SIZE; c++) {
        this.props.drawCard();
      }
    });
  }

  onClick(e) {
    const { myDeck } = this.props.gameState;
    if (myDeck.length > 0) {
      this.props.drawCard();
    }
  }

  render() {
    const { myDeck } = this.props.gameState;

    return (
      <div id="deck">
        <div id="image-bg">
          <DeckOps deck={myDeck} position={Position.TOP_LEFT} deckname="myDeck" dragType="handCard"/>
          <Button onClick={this.onClick.bind(this)} style={{marginTop: "10px"}}>Draw</Button>
        </div>
        <div id="counter">{`${myDeck.length} in deck`}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ gameState: state.gameState });

const mapDispatchToProps = dispatch => ({
  applyMana: num => dispatch(applyMana(num)),
  setMyDeck: deck => dispatch(setMyDeck(deck)),
  drawCard: () => dispatch(drawCard())
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true
})(MyDeck);
