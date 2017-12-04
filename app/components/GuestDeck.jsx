import React, {Component} from "react";
import {connect} from "react-redux";
import GuestCard from "./GuestCard";
import {setGuestDeck} from "../actions";
import Papa from "papaparse";

import "./GuestDeck.css";

class GuestDeck extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      faceup: []
    };
  }

  componentDidMount() {
    //const foodCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFtDoZRo1q_et75CgtM3GHHXlIHiuip-GJ9wdx5iZVjI05KvhWI5fQCbxQVoBIvEy0kTASL151dJyS/pub?output=csv";
    const guestCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFtDoZRo1q_et75CgtM3GHHXlIHiuip-GJ9wdx5iZVjI05KvhWI5fQCbxQVoBIvEy0kTASL151dJyS/pub?output=csv&gid=1152907192";
    Papa.parse(guestCSV, {
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
    this.props.setGuestDeck(deck);
  }

  render() {

    const {guestDeck, guestDiscard} = this.props.gameState;
    const FACEUP_COUNT = 4;
    const faceup = guestDeck.slice(-FACEUP_COUNT);
    let remaining = guestDeck.length - FACEUP_COUNT;
    if (remaining < 0) remaining = 0;

    const faceupList = faceup.map(c => <li key={c.id} className="faceup-item"><GuestCard dragType="guestCard" {...c} /></li>);

    return (
      <div id="guestdeck">
        <div style={{float: "left"}}>{`${remaining} in deck`}</div>
        <div style={{float: "right"}}>{`${guestDiscard.length} in discard`}</div>
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
    setGuestDeck: guestDeck => {
      dispatch(setGuestDeck(guestDeck))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(GuestDeck); 

