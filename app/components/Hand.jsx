import React, {Component} from "react";
import {connect} from "react-redux";
import {applyMana} from "../actions";
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

    const {hand} = this.props.gameState;
    const handList = hand.map(c => <li key={c.id} className="hand-item"><FoodCard dragType="handCard" {...c} /></li>);

    return (
      <div id="hand-container">
        <ul id="hand-list">
          {handList}
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
    applyMana: num => {
      dispatch(applyMana(num))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(Hand); 


