import React, { Component } from "react";
import { connect } from "react-redux";
import GuestCard from "./GuestCard";
import { setGuestDeck } from "../actions";
import DeckOps from "./DeckOps";
import GuestDiscard from "./GuestDiscard";
import { Position } from "@blueprintjs/core";
import Papa from "papaparse";

import "./GuestDeck.css";

class GuestDeck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faceup: []
    };
  }

  componentDidMount() {
    const guestCSV =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFtDoZRo1q_et75CgtM3GHHXlIHiuip-GJ9wdx5iZVjI05KvhWI5fQCbxQVoBIvEy0kTASL151dJyS/pub?output=csv&gid=1152907192";
    Papa.parse(guestCSV, {
      download: true,
      header: true,
      complete: data => this.fillDeck(data.data)
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
    this.props.setGuestDeck(deck);
  }

  render() {
    const { guestDeck, guestDiscard } = this.props.gameState;
    const FACEUP_COUNT = 4;
    const faceup = guestDeck.slice(-FACEUP_COUNT);
    let remaining = guestDeck.length - FACEUP_COUNT;
    if (remaining < 0) remaining = 0;

    const faceupList = faceup.map(c => (
      <GuestCard 
        key={c.id} 
        dragType="guestCard" 
        className="faceup-item"
        position={Position.LEFT_BOTTOM}
        {...c} />
    ));

    return (
      <div id="guestdeck">
        <div>
          <div id="image-bg">
            <DeckOps deck={guestDeck} position={Position.LEFT_TOP} deckname="guestDeck" dragType="guestCard"/>
          </div>
          <div id="counter">{`${remaining} in deck`}</div>        
        </div>
        {faceupList}
        <GuestDiscard dragType="guestCard"/>
      </div>
    );
  }
}

const mapStateToProps = state => ({ gameState: state.gameState });

const mapDispatchToProps = dispatch => ({
  setGuestDeck: guestDeck => dispatch(setGuestDeck(guestDeck))
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true
})(GuestDeck);
