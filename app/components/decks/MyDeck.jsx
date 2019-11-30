import React, { Component } from "react";
import { connect } from "react-redux";
import { setMyDeck, drawCard } from "../../actions";
import DeckOps from "../ops/DeckOps";
import { Button, Position } from "@blueprintjs/core";
import { starting } from "../../cardData";

import "./MyDeck.css";

const OPENING_HAND_SIZE = 4;

class MyDeck extends Component {
  
  getPlayer() {
    return this.props.gameState.players[
      this.props.opponent ? this.props.gameState.opponentId : this.props.gameState.playerId
    ];
  }

  componentDidMount() {
    const { myDeck } = this.getPlayer();

    if (!myDeck.length) {
      starting.then(cards => {
        this.props.setMyDeck(cards.sort(() => Math.random() - 0.5));
        for (let c = 0; c < OPENING_HAND_SIZE; c++) {
          this.props.drawCard();
        }
      });
    }
  }

  onClick(e) {
    const { myDeck } = this.getPlayer();

    if (myDeck.length > 0) {
      this.props.drawCard();
    }
  }

  render() {
    const { myDeck } = this.getPlayer();

    return (
      <div id="deck">
        <div id="image-bg">
          <DeckOps
            deck={myDeck}
            position={Position.TOP_LEFT}
            deckname="myDeck"
            dragType="handCard"
          />
          <Button
            onClick={this.onClick.bind(this)}
            style={{ marginTop: "10px" }}
          >
            Draw
          </Button>
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
  forwardRef: true
})(MyDeck);
