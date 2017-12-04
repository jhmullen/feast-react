import React, {Component} from "react";
import {connect} from "react-redux";
import {applyMana} from "../actions";
import GuestCard from "./GuestCard.jsx";
import TableSpot from "./TableSpot.jsx"

import "./Party.css";

class Party extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
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
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(Party); 


