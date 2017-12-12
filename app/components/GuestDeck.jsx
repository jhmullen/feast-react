import React, { Component } from 'react';
import { connect } from 'react-redux';
import GuestCard from './GuestCard';
import { setGuestDeck } from '../actions';
import DeckOps from './DeckOps';
import GuestDiscard from './GuestDiscard';
import { Position } from '@blueprintjs/core';
import Papa from 'papaparse';
import { guests } from '../cardData';
import './GuestDeck.css';

class GuestDeck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faceup: [],
    };
  }

  componentDidMount() {
    guests.then(cards =>
      this.props.setGuestDeck(cards.sort(() => Math.random() - 0.5)),
    );
  }

  render() {
    const { guestDeck, guestDiscard } = this.props.gameState;
    const FACEUP_COUNT = 4;
    const faceup = guestDeck.slice(-FACEUP_COUNT);
    let remaining = guestDeck.length - FACEUP_COUNT;
    if (remaining < 0) remaining = 0;

    const faceupList = faceup.map(c => (
      <GuestCard
        key={c.id}
        dragType="guestCard"
        className="faceup-item"
        position={Position.LEFT_TOP}
        {...c}
      />
    ));

    return (
      <div id="guestdeck">
        <div>
          <div id="image-bg" style={{ display: 'block', marginRight: '10px' }}>
            <DeckOps
              deck={guestDeck}
              position={Position.LEFT_TOP}
              deckname="guestDeck"
              dragType="guestCard"
            />
          </div>
          <div id="counter">{`${remaining} in deck`}</div>
        </div>
        <GuestDiscard dragType="guestCard" />
        {faceupList}
      </div>
    );
  }
}

const mapStateToProps = state => ({ gameState: state.gameState });

const mapDispatchToProps = dispatch => ({
  setGuestDeck: guestDeck => dispatch(setGuestDeck(guestDeck)),
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true,
})(GuestDeck);
