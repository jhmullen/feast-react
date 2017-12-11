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
import { setPrestige, setMana } from "../actions";
import { Toaster, Position, Intent, NumericInput } from "@blueprintjs/core";

import "./App.css";

class App extends Component {

  setPrestige(num) {
    this.props.setPrestige(num);
  }

  setMana(num) {
    this.props.setMana(num);
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
            <div style={{display: "flex", width: "540px", justifyContent: "space-between", position:"absolute", top: "-40px", right: "20px", fontSize: "16px"}}>
              <div>Mana: </div>
              <NumericInput 
                value={this.props.gameState.mana} 
                onValueChange={this.setMana.bind(this)}
              />
              <div>Prestige: </div>
              <NumericInput 
                value={this.props.gameState.prestige} 
                onValueChange={this.setPrestige.bind(this)}
              />
            </div>
            <MyDeck />
            <Discard dragType="handCard" />
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

const mapDispatchToProps = dispatch => ({
  setMana: num => dispatch(setMana(num)),
  setPrestige: num => dispatch(setPrestige(num))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
