import React, {Component} from "react";
import {connect} from "react-redux";
import {applyMana} from "../actions";

import "./TableSpot.css";

class TableSpot extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }

  render() {

    const {spotNum} = this.props;

    return (
      <div id="tablespot">
        {spotNum+1}
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

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(TableSpot); 


