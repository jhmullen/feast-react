import React, { Component } from "react";
import { connect } from "react-redux";
import { findDOMNode } from "react-dom";
import { DropTarget } from "react-dnd";
import { applyMana, setHand, trashCard } from "../actions";
import { Toaster, Position, Intent } from "@blueprintjs/core";

import "./Trash.css";

class Trash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }

  handleTrash(card) {
    this.props.trashCard(card.id);
    const castToast = Toaster.create({
      className: "castToast",
      position: Position.TOP_CENTER
    });
    castToast.show({
      message: `You Trashed ${card.name}!`,
      intent: Intent.WARNING,
      timeout: 1500
    });
  }

  render() {
    const { trash } = this.props.gameState;

    const { isOver, canDrop, connectDropTarget } = this.props;

    return connectDropTarget(
      <div id="trash">
        <div id="trash-bg" className={isOver ? "fade" : null}>
          Trash
        </div>
        <div id="counter">{`${trash.length} in trash`}</div>
      </div>
    );
  }
}

const trashTarget = {
  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      return;
    }
    const item = monitor.getItem();
    component.getWrappedInstance().handleTrash(item);
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
  trashCard: id => dispatch(trashCard(id))
});

Trash = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(
  Trash
);

export default DropTarget(
  props => {
    return props.dragType;
  },
  trashTarget,
  collect
)(Trash);
