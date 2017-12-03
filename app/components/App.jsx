import React, {Component} from "react";
import { connect } from 'react-redux'
import Deck from "./Deck";
import Card from "./Card";
import Cast from "./Cast";
import Draw from "./Draw";
import Buy from "./Buy";
import {applyMana} from '../actions'
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import "./App.css";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      hand: []
    };
  }

  handleDrawCard(card) {
    const {hand} = this.state;
    hand.push(card);
    this.setState({hand});
  }

  dropCard(card) {
    let {hand} = this.state;
    hand = hand.filter(c => c.id != card.id);
    this.setState({hand});
  }

  buyCard(card) {

  }

  onCast(card) {
    console.log(card);
  }

  render() {

    const {hand} = this.state;
    const handList = hand.map(c => <li key={c.id} className="hand-item"><Card dragType="handCard" dropCard={this.dropCard.bind(this)} {...c} /></li>);

    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div id="board">
          <Draw />
          <Buy dragType="buyCard" buyCard={this.buyCard.bind(this)}/>
          <Deck onClick={this.handleDrawCard.bind(this)}/>
          <div id="hand-container">
            <ul id="hand-list">
              {handList}
            </ul>
          </div>
          <Cast dragType="handCard" onCast={this.onCast.bind(this)}/>
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
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
