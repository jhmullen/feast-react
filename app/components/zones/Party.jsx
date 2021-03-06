import React, { Component } from 'react';
import { connect } from 'react-redux';
import { applyMana, endTurn, moveParty } from '../../actions';
import GuestCard from '../cards/GuestCard.jsx';
import TableSpot from './TableSpot.jsx';
import { Toaster, Button, Position, Intent } from '@blueprintjs/core';

import './Party.css';

class Party extends Component {
  endTurn() {
    this.props.endTurn();
  }

  moveRight() {
    this.props.moveParty(1);
  }

  moveLeft() {
    this.props.moveParty(-1);
  }

  render() {
    
    const { party } = this.props.gameState.players[
      this.props.opponent ? this.props.gameState.opponentId : this.props.gameState.playerId
    ];

    const show = !this.props.opponent;

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
                {...guests[g]}
              />
            </div>,
          );
          guestList.push(
            <div key={`spacehack-${g}`}>
              <br />
              <br />
              <br />
              <br />
            </div>,
          );
        }
        partyList.push(
          <div
            key={`table-${p}`}
            className="hand-item"
            style={{ width: '80px' }}
          >
            {guestList}
          </div>,
        );
      } else {
        partyList.push(
          <div key={`table-${p}`} className="hand-item">
            <div className="placeholder">{show && "Drag a guest above"}</div>
          </div>,
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
      <div id={`party${show ? "" : "-opponent"}`}>
        {show && <div style={{ position: 'absolute', left: '5px', top: '-35px' }}>
          <Button icon="cross" onClick={this.endTurn.bind(this)} />
          <Button icon="arrow-left" onClick={this.moveLeft.bind(this)} />
          <Button icon="arrow-right" onClick={this.moveRight.bind(this)} />
        </div>}
        {show && <div className="party-container">{tableSpots}</div>}
        <div className="party-container">{partyList}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ gameState: state.gameState });

const mapDispatchToProps = dispatch => ({
  applyMana: num => dispatch(applyMana(num)),
  endTurn: () => dispatch(endTurn()),
  moveParty: num => dispatch(moveParty(num)),
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(Party);
