import React, {Component} from "react";
import {connect} from "react-redux";
import {applyMana} from "../actions";

import "./Discard.css";

class Discard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }

  render() {

    const {discard} = this.props.gameState;

    return (
      <div id="discard" >
        <div id="image-bg">
          { /* css background-image */ }
        </div>
        <div id="counter">
          { `${discard.length} in discard` }
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(Discard); 


