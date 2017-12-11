import React, { Component } from "react";
import { connect } from "react-redux";
import { applyMana } from "../actions";
import { Position } from "@blueprintjs/core";
import DeckOps from "./DeckOps";

import "./Discard.css";

class Discard extends Component {

  render() {
    const { discard } = this.props.gameState;

    return (
      <div id="discard">
        <div id="image-bg">
          <DeckOps deck={discard} position={Position.TOP_LEFT} deckname="discard" dragType="handCard"/>
        </div>
        <div id="counter">{`${discard.length} in discard`}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ gameState: state.gameState });

const mapDispatchToProps = dispatch => ({
  applyMana: num => dispatch(applyMana(num))
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true
})(Discard);
