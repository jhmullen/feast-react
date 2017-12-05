import React, {Component} from "react";
import { connect } from "react-redux";
import MyDeck from "./MyDeck";
import Discard from "./Discard";
import Cast from "./Cast";
import Draw from "./Draw";
import Buy from "./Buy";
import Hand from "./Hand";
import Party from "./Party";
import {DragDropContextProvider} from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import {Toaster, Position, Intent, Button} from "@blueprintjs/core";

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
          <Draw />
          <Buy dragType="buyCard" />
          <MyDeck />
          <Discard />
          <Party />
          <Hand />
          <Cast dragType="handCard" />
        </div>
      </DragDropContextProvider>
    );
  }
}

const mapStateToProps = state => ({gameState: state.gameState});

export default connect(mapStateToProps)(App);
