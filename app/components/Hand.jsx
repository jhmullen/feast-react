import React, { Component } from "react";
import { connect } from "react-redux";
import { applyMana } from "../actions";
import { Position } from "@blueprintjs/core";
import FoodCard from "./FoodCard.jsx";

import "./Hand.css";

class Hand extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }

  render() {
    const { hand } = this.props.gameState;
    const handList = hand.map(c => (
      <FoodCard 
        key={c.id} 
        className="hand-item" 
        dragType="handCard" 
        position={Position.TOP}
        {...c} 
      />
    ));

    return (
      <div id="hand-container">
        {handList}
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
})(Hand);
