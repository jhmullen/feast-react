import React, {Component} from "react";
import {connect} from "react-redux";
import {applyMana, endTurn} from "../actions";
import GuestCard from "./GuestCard.jsx";
import TableSpot from "./TableSpot.jsx";
import {Button} from "@blueprintjs/core";

import "./Party.css";

class Party extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }

  endTurn() {
    this.props.endTurn();
  }

  render() {

    const {party} = this.props.gameState;
    const partyList = [];
    for (let p = 0; p < party.length; p++) {
      if (party[p].length > 0) {
        partyList.push(<li key={party[p][0].id} className="hand-item"><GuestCard dragType="guestCard" {...party[p][0]} /></li>);
      }
      else {
        partyList.push(<li key={`table-${p}`} className="hand-item"><TableSpot dragType="guestCard" spotNum={p} /></li>);
      }
    }

    return (
      <div id="party">
        <div style={{float:"left"}}>
          <Button className="pt-button pt-small" onClick={this.endTurn.bind(this)}>
            End Turn
          </Button>
        </div>
        <ul>
          {partyList}
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
    },
    endTurn: () => {
      dispatch(endTurn())
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(Party); 


