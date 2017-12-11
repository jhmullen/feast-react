import React, { Component } from 'react';
import { connect } from 'react-redux';
import FoodCard from './FoodCard';
import { setFaceupFood, setFoodDeck } from '../actions';
import { Position, Button } from "@blueprintjs/core";
import Papa from 'papaparse';
import Buy from "./Buy";
import DeckOps from "./DeckOps";

import './FoodDeck.css';

class FoodDeck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faceup: []
    };
  }

  componentDidMount() {
    const foodCSV =
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vRFtDoZRo1q_et75CgtM3GHHXlIHiuip-GJ9wdx5iZVjI05KvhWI5fQCbxQVoBIvEy0kTASL151dJyS/pub?output=csv';
    Papa.parse(foodCSV, {
      download: true,
      header: true,
      complete: data => this.fillDeck(data.data),
    });
  }

  fillDeck(data) {
    const deck = data.sort(() => Math.random() - 0.5);
    for (const d of deck) {
      for (const key in d) {
        if (d.hasOwnProperty(key)) {
          if (!isNaN(parseInt(d[key]))) d[key] = parseInt(d[key]);
        }
      }
    }
    this.props.setFoodDeck(deck);
  }

  render() {
    const { foodDeck } = this.props.gameState;
    const FACEUP_COUNT = 4;
    const faceup = foodDeck.slice(-FACEUP_COUNT);
    let remaining = foodDeck.length - FACEUP_COUNT;
    if (remaining < 0) remaining = 0;

    const faceupList = faceup.map(c => (
      <FoodCard 
        key={c.id} 
        dragType="buyCard" 
        mana={this.props.gameState.mana} 
        position={Position.LEFT_TOP}
        {...c} />
    ));

    return (
      <div id="fooddeck">
         <div>
          <div id="image-bg">
            <DeckOps deck={foodDeck} position={Position.LEFT_TOP} deckname="foodDeck" dragType="buyCard"/>
          </div>
          <div id="counter">{`${remaining} in deck`}</div>        
        </div>
        {faceupList}
        <Buy dragType="buyCard" />
      </div>
    );
  }
}

const mapStateToProps = state => ({ gameState: state.gameState });

const mapDispatchToProps = dispatch => ({
  setFoodDeck: foodDeck => dispatch(setFoodDeck(foodDeck)),
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true,
})(FoodDeck);
