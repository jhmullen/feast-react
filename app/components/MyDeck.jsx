import React, { Component } from "react";
import { connect } from "react-redux";
import { setMyDeck, drawCard } from "../actions";

import "./MyDeck.css";

class MyDeck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }

  componentDidMount() {
    const deck = [];
    for (let i = 0; i < 5; i++) {
      var obj = {
        id: `starter-${i}`,
        name: "Starter Spell",
        cost: 1,
        desc: "food +1",
        food_mod: 1,
        prestige_mod: 0
      };
      deck.push(obj);
    }
    this.props.setMyDeck(deck);
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
      <div id="deck" onClick={this.onClick.bind(this)}>
        <div id="image-bg">{/* css background-image */}</div>
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
