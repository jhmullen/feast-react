import React, {Component} from "react";
import Papa from "papaparse";

import "./Deck.css";

export default class Deck extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      deck: []
    };
  }

  componentDidMount() {
    const foodCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFtDoZRo1q_et75CgtM3GHHXlIHiuip-GJ9wdx5iZVjI05KvhWI5fQCbxQVoBIvEy0kTASL151dJyS/pub?output=csv";
    Papa.parse(foodCSV, {
      download: true,
      header: true,
      complete: data => this.fillDeck(data.data)
    });
  }

  fillDeck(data) {
    const deck = data.sort(() => Math.random() - .5);
    for (const d of deck) {
      for (const key in d) {
        if (d.hasOwnProperty(key)) {
          if (!isNaN(parseInt(d[key]))) d[key] = parseInt(d[key]);
        }
      }
    }
    this.setState({deck});
  }

  onClick(e) {
    const {deck} = this.state;
    if (deck.length > 0) {
      const card = deck.splice(-1, 1)[0];
      if (this.props.onClick) this.props.onClick(card);
      this.setState({deck});
    }
  }

  render() {

    const {deck} = this.state;

    return (
      <div id="deck" onClick={this.onClick.bind(this)} >
        <div id="image-bg">
          { /* css background-image */ }
        </div>
        <div id="counter">
          { `${deck.length} remaining` }
        </div>
      </div>
    );

  }
}

