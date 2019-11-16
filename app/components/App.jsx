import React, { Component } from "react";
import { connect } from "react-redux";

import PickPlayer from "./PickPlayer";

import Party from "./zones/Party";
import Playboard from "./zones/Playboard";

import FoodDeck from "./decks/FoodDeck";
import GuestDeck from "./decks/GuestDeck";

import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { Toaster, Position, Intent, NumericInput } from "@blueprintjs/core";

import { pickPlayer, setPrestige, setMana } from "../actions";

import "./App.css";

const prestigeToast = Toaster.create({
  className: "prestigeToast",
  position: Position.TOP_CENTER
});

class App extends Component {
  
  componentDidUpdate(prevProps) {
    
    if (!this.props.gameState.playerId) {
      return;
    }

    const { players, playerId } = this.props.gameState;
    const player = players[playerId];
    const { players: prevPlayers } = prevProps.gameState;
    const prevPlayer = prevPlayers[playerId];

    if (player.prestige != prevPlayer.prestige) {
      const diff = player.prestige - prevPlayer.prestige;
      prestigeToast.show({
        message: `You ${diff > 0 ? "Earned" : "Lost"} ${Math.abs(
          diff
        )} Prestige Point${Math.abs(diff) != 1 ? "s" : ""}!`,
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
    if (!this.props.gameState.playerId) {
      return <PickPlayer pickPlayer={this.props.pickPlayer} />;
    }

    const { players, playerId } = this.props.gameState;
    const player = players[playerId];

    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div id="board">
          <div>
            <FoodDeck />
            <GuestDeck />
          </div>
          <div id="party-row-opponent">
            <Party opponent={true} />
          </div>
          <div id="party-row">
            <Party />
          </div>
          <div>
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
          <div id="hand-row">
            <Playboard />
          </div>
        </div>
      </DragDropContextProvider>
    );
  }
}

const mapStateToProps = state => ({ gameState: state.gameState });

const mapDispatchToProps = dispatch => ({
  pickPlayer: id => dispatch(pickPlayer(id)),
  setMana: num => dispatch(setMana(num)),
  setPrestige: num => dispatch(setPrestige(num))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
