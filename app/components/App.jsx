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
import Aura from "./Aura";
import FoodDeck from "./FoodDeck";
import GuestDeck from "./GuestDeck";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { setPrestige, setMana } from "../actions";
import { Toaster, Position, Intent, NumericInput } from "@blueprintjs/core";

import "./App.css";

const prestigeToast = Toaster.create({
  className: "prestigeToast",
  position: Position.TOP_CENTER
});

class App extends Component {

  componentWillUpdate(nextProps) {
    if (this.props.gameState.prestige != nextProps.gameState.prestige) {
      const diff = nextProps.gameState.prestige - this.props.gameState.prestige;
      prestigeToast.show({
        message: `You ${diff > 0 ? "Earned" : "Lost"} ${Math.abs(diff)} Prestige Point${Math.abs(diff) != 1 ? "s" : ""}!`,
        intent: diff > 0 ? Intent.SUCCESS : Intent.DANGER,
        timeout: 1500
      }); 
    }
  }

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
          <div>
            <FoodDeck />
            <GuestDeck />
          </div>
          <div id="party-row">
            <Party />
          </div>
          <div id="hand-row">
            <div style={{display: "flex", width: "500px", justifyContent: "space-between", position:"absolute", top: "-40px", right: "10px", fontSize: "16px"}}>
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
            <Aura dragType={["handCard", "buyCard"]} />
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
