import React, { Component } from "react";
import { connect } from "react-redux";
import { DropTarget } from "react-dnd";
import { discardFromHand } from "../actions";
import { Position, Toaster, Intent} from "@blueprintjs/core";
import DeckOps from "./DeckOps";

import "./Discard.css";

class Discard extends Component {

  handleDiscard(card) {
    this.props.discardFromHand(card.id);
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
    const { discard } = this.props.gameState;

    const { isOver, canDrop, connectDropTarget } = this.props;

    return connectDropTarget(
      <div id="discard">
        <div id="image-bg">
          <DeckOps deck={discard} position={Position.TOP_LEFT} deckname="discard" dragType="handCard"/>
        </div>
        <div id="counter">{`${discard.length} in discard`}</div>
      </div>
    );
  }
}

const discardTarget = {
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
  discardFromHand: id => dispatch(discardFromHand(id))
});

Discard = connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true
})(Discard);

export default DropTarget(
  props => {
    return props.dragType;
  },
  discardTarget,
  collect
)(Discard);
