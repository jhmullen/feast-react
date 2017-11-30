import React, {Component} from "react";
import Deck from "./Deck";
import Card from "./Card";

import "./App.css";

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      hand: []
    };
  }

  clickDeckHandler(card) {
    const {hand} = this.state;
    hand.push(card);
    this.setState({hand});
  }

  render() {

    const {hand} = this.state;
    const handList = hand.map(c => <li key={c.id} className="hand-item"><Card {...c} /></li>);

    return (
      <div id="board">
        <Deck id="deck" onClick={this.clickDeckHandler.bind(this)}/>
        <div id="hand-container">
          <ul id="hand-list">
            {handList}
          </ul>
        </div>
      </div>
    );

  }
}

