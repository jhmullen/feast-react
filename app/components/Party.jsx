import React, { Component } from "react";
import { connect } from "react-redux";
import { applyMana, endTurn } from "../actions";
import GuestCard from "./GuestCard.jsx";
import TableSpot from "./TableSpot.jsx";
import { Button, Position } from "@blueprintjs/core";

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
    const { party } = this.props.gameState;
    const partyList = [];
    for (let p = 0; p < party.length; p++) {
      if (party[p].length > 0) {
        const guests = party[p];
        const guestList = [];
        for (let g = 0; g < guests.length; g++) {
          guestList.push(
            <div key={guests[g].id} className="stacker">
              <GuestCard 
                key={g.id} 
                dragType="guestCard" 
                position={Position.TOP}
                {...guests[g]} />
            </div>
          );
          guestList.push(
            <div key={`spacehack-${g}`}>
              <br />
              <br />
              <br />
              <br />
            </div>
          );
        }
        partyList.push(
          <div
            key={`table-${p}`}
            className="hand-item"
            style={{ width: "80px" }}
          >
            {guestList}
          </div>
        );
      } else {
        partyList.push(
          <div key={`table-${p}`} className="hand-item">
            <div className="placeholder">Drag a guest above</div>
          </div>
        );
      }
    }

    const tableSpots = [];
    for (let i = 0; i < party.length; i++) {
      tableSpots[i] = (
        <div key={`table-${i}`} className="hand-item">
          <TableSpot dragType="guestCard" spotNum={i} />
        </div>
      );
    }

    return (
      <div id="party">
        <div style={{ position: "absolute", left: "5px", bottom: "5px" }}>
          <Button
            className="pt-button pt-small"
            onClick={this.endTurn.bind(this)}
          >
            {<span className="pt-icon-arrow-left" />}
          </Button>
        </div>
        <div className="party-container">{tableSpots}</div>
        <div className="party-container">{partyList}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ gameState: state.gameState });

const mapDispatchToProps = dispatch => ({
  applyMana: num => dispatch(applyMana(num)),
  endTurn: () => dispatch(endTurn())
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true
})(Party);
