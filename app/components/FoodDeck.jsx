import React, {Component} from "react";
import {connect} from "react-redux";
import Card from "./Card";
import {setFaceupFood} from "../actions";

import "./FoodDeck.css";

class FoodDeck extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }

  componentDidMount() {
    this.populate();
  }

  populate() {
    const faceup = [];
    for (let i = 0; i < 4; i++) {
      const obj = {
        id: i,
        mana: Math.floor(Math.random() * 12) + 1,
        name: "Buy Me"
      }
      faceup.push(obj);
    }
    this.props.setFaceupFood(faceup);
  }

  render() {

    const {faceup_food} = this.props.gameState;

    const faceupList = faceup_food.map(c => <li key={c.id} className="faceup-item"><Card dragType="buyCard" {...c} /></li>);

    return (
      <div id="fooddeck">
        <ul>
          {faceupList}
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
    setFaceupFood: faceup_food => {
      dispatch(setFaceupFood(faceup_food))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(FoodDeck); 

