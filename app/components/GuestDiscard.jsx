import React, { Component } from "react";
import { connect } from "react-redux";
import { DropTarget } from "react-dnd";
import { applyMana, discardGuest } from "../actions";
import { Toaster, Position, Intent } from "@blueprintjs/core";
import DeckOps from "./DeckOps";

import "./GuestDiscard.css";

class GuestDiscard extends Component {
  handleDiscard(card) {
    this.props.discardGuest(card.id);
    const castToast = Toaster.create({
      className: "castToast",
      position: Position.TOP_CENTER
    });
    castToast.show({
      message: `You Discarded ${card.name}!`,
      intent: Intent.WARNING,
      timeout: 1500
    });
  }

  render() {
    const { guestDiscard } = this.props.gameState;

    const { isOver, canDrop, connectDropTarget } = this.props;

    return connectDropTarget(
      <div>
        <div id="image-bg" style={{ display: "block" }}>
          <DeckOps
            deck={guestDiscard}
            position={Position.LEFT_TOP}
            deckname="guestDiscard"
            dragType="guestCard"
          />
        </div>
        <div id="counter">{`${guestDiscard.length} in discard`}</div>
      </div>
    );
  }
}

const guestDiscardTarget = {
  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      return;
    }
    const item = monitor.getItem();
    component.getWrappedInstance().handleDiscard(item);
    return item;
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
}

const mapStateToProps = state => ({ gameState: state.gameState });

const mapDispatchToProps = dispatch => ({
  applyMana: num => dispatch(applyMana(num)),
  discardGuest: id => dispatch(discardGuest(id))
});

GuestDiscard = connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true
})(GuestDiscard);

export default DropTarget(
  props => {
    return props.dragType;
  },
  guestDiscardTarget,
  collect
)(GuestDiscard);
