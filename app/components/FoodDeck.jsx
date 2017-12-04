import React, {Component} from "react";
import {connect} from "react-redux";
import FoodCard from "./FoodCard";
import {setFaceupFood, setFoodDeck} from "../actions";
import Papa from "papaparse";

import "./FoodDeck.css";

class FoodDeck extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      faceup: []
    };
  }

  componentDidMount() {
    const foodCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFtDoZRo1q_et75CgtM3GHHXlIHiuip-GJ9wdx5iZVjI05KvhWI5fQCbxQVoBIvEy0kTASL151dJyS/pub?output=csv";
    //const guestCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFtDoZRo1q_et75CgtM3GHHXlIHiuip-GJ9wdx5iZVjI05KvhWI5fQCbxQVoBIvEy0kTASL151dJyS/pub?output=csv&gid=1152907192";
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
    this.props.setFoodDeck(deck);
  }

  render() {

    const {foodDeck} = this.props.gameState;
    const FACEUP_COUNT = 4;
    const faceup = foodDeck.slice(-FACEUP_COUNT);
    let remaining = foodDeck.length - FACEUP_COUNT;
    if (remaining < 0) remaining = 0;

    const faceupList = faceup.map(c => <li key={c.id} className="faceup-item"><FoodCard dragType="buyCard" {...c} /></li>);

    return (
      <div id="fooddeck">
        <div style={{float: "left"}}>{`${remaining} remaining`}</div>
        <ul>
          {faceupList}
        </ul>
      </div>
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
    setFoodDeck: foodDeck => {
      dispatch(setFoodDeck(foodDeck))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(FoodDeck); 

