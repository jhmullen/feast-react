import React, { Component } from "react";
import { connect } from "react-redux";
import MyDeck from "../decks/MyDeck";
import Discard from "../decks/Discard";
import Cast from "../casters/Cast";
import Hand from "../zones/Hand";
import Trash from "../casters/Trash";
import Aura from "../casters/Aura";

import "./Playboard.css";

class Playboard extends Component {

  render() {
    
    return (
      <div id="playboard">
        <MyDeck {...this.props} />
        <Discard dragType="handCard" {...this.props}/>
        <Hand {...this.props}/>
        <Cast dragType="handCard" {...this.props}/>
        <Trash dragType={["handCard", "guestCard", "buyCard"]} {...this.props}/>
        <Aura dragType={["handCard", "buyCard"]} {...this.props}/>
      </div>
    );
  }
}

export default Playboard;
