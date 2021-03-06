import React, { Component } from "react";
import { connect } from "react-redux";
import { applyMana, shuffle } from "../../actions";
import {
  Button,
  Popover,
  PopoverInteractionKind,
  Position
} from "@blueprintjs/core";
import FoodCard from "../cards/FoodCard.jsx";
import GuestCard from "../cards/GuestCard.jsx";

import "./DeckOps.css";

class DeckOps extends Component {
  shuffleDeck() {
    const { deckname } = this.props;
    this.props.shuffle(deckname);
  }

  render() {
    const { position, deck, deckname, dragType } = this.props;

    let cardList = [];
    if (["myDeck", "foodDeck", "discard", "aura"].includes(deckname)) {
      cardList = deck.map(c => (
        <FoodCard
          key={c.id}
          compact={true}
          className="hand-item"
          dragType={dragType}
          position={Position.RIGHT}
          {...c}
        />
      ));
    } else {
      cardList = deck.map(c => (
        <GuestCard
          key={c.id}
          compact={true}
          className="hand-item"
          dragType={dragType}
          position={Position.RIGHT}
          {...c}
        />
      ));
    }

    return (
      <div id="deckops">
        <Popover
          interactionKind={PopoverInteractionKind.CLICK}
          popoverClassName="pt-popover-content-sizing"
          position={position}
        >
          <Button icon="layers" />
          <div id="deckops-popover">{cardList}</div>
        </Popover>
        <br />
        <Button icon="refresh" onClick={this.shuffleDeck.bind(this)} />
      </div>
    );
  }
}

const mapStateToProps = state => ({ gameState: state.gameState });

const mapDispatchToProps = dispatch => ({
  applyMana: num => dispatch(applyMana(num)),
  shuffle: deckname => dispatch(shuffle(deckname))
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true
})(DeckOps);
