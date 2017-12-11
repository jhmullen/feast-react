import React, { Component } from "react";
import { connect } from "react-redux";
import MyDeck from "./MyDeck";
import Discard from "./Discard";
import Cast from "./Cast";
import Draw from "./Draw";
import Buy from "./Buy";
import Hand from "./Hand";
import Party from "./Party";
import Trash from "./Trash";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { Toaster, Position, Intent, Button } from "@blueprintjs/core";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }

  render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div id="board">
          <div id="buy-row">
            <Draw />
          </div>
          <div id="party-row">
            <Party />
          </div>
          <div id="hand-row">
            <div style={{position:"absolute", top: "-20px", right: "5px", fontSize: "16px"}}>Prestige: {this.props.gameState.prestige}</div>
            <MyDeck />
            <Discard />
            <Hand />
            <Cast dragType="handCard" />
            <Trash dragType={["handCard", "guestCard", "buyCard"]} />
          </div>
        </div>
      </DragDropContextProvider>
    );
  }
}

const mapStateToProps = state => ({ gameState: state.gameState });

export default connect(mapStateToProps)(App);
