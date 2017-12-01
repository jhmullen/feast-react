import React, {Component} from "react";
import Deck from "./Deck";
import Card from "./Card";
import Cast from "./Cast";
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import "./App.css";

export default class App extends Component {

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

  handlePlayCard(card) {
    let {hand} = this.state;
    hand = hand.filter(c => c.id != card.id);
    this.setState({hand});
  }

  render() {

    const {hand} = this.state;
    const handList = hand.map(c => <li key={c.id} className="hand-item"><Card handlePlayCard={this.handlePlayCard.bind(this)} {...c} /></li>);

    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div id="board">
          <Deck onClick={this.handleDrawCard.bind(this)}/>
          <div id="hand-container">
            <ul id="hand-list">
              {handList}
            </ul>
          </div>
          <Cast />
        </div>
      </DragDropContextProvider>
    );

  }
}

//export default DragDropContext(HTML5Backend)(App);
