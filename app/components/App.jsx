import React, {Component} from "react";
import { connect } from "react-redux";
import Deck from "./Deck";
import Card from "./Card";
import Cast from "./Cast";
import Draw from "./Draw";
import Buy from "./Buy";
import {applyMana, setHand} from "../actions"
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import {Toaster, Position, Intent, Button} from "@blueprintjs/core";

import "./App.css";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }

  handleDrawCard(card) {
    const {hand} = this.props.gameState;
    hand.push(card);
    this.props.setHand(hand);
  }

  render() {

    const {hand} = this.props.gameState;
    const handList = hand.map(c => <li key={c.id} className="hand-item"><Card dragType="handCard" {...c} /></li>);

    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div id="board">
          <Draw />
          <Buy dragType="buyCard" />
          <Deck onClick={this.handleDrawCard.bind(this)}/>
          <div id="hand-container">
            <ul id="hand-list">
              {handList}
            </ul>
          </div>
          <Cast dragType="handCard" />
        </div>
      </DragDropContextProvider>
    );
  }
}

const mapStateToProps = state => {
  return { 
    gameState: state.gameState
  }
};

const mapDispatchToProps = dispatch => {
  return {
    applyMana: num => {
      dispatch(applyMana(num))
    },
    setHand: hand => {
      dispatch(setHand(hand))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
