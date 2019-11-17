import React, { Component } from "react";
import { connect } from "react-redux";
import { findDOMNode } from "react-dom";
import { DropTarget } from "react-dnd";
import { applyMana, setHand, playCard } from "../../actions";
import { Toaster, Position, Intent } from "@blueprintjs/core";

import "./Cast.css";

class Cast extends Component {
  
  handleCast(card) {
    this.props.applyMana(card.food_mod);
    this.props.playCard(card.id);
    const castToast = Toaster.create({
      className: "castToast",
      position: Position.TOP_CENTER
    });
    castToast.show({
      message: `You Cast ${card.name}!`,
      intent: Intent.SUCCESS,
      timeout: 1500
    });
  }

  render() {
    const { mana } = this.props.gameState.players[
      this.props.gameState.playerId
    ];

    const { isOver, canDrop, connectDropTarget } = this.props;

    return connectDropTarget(
      <div id="cast">
        <div id="cast-bg" className={isOver ? "fade" : null}>
          Cast
        </div>
        <div id="counter">{`${mana} mana`}</div>
      </div>
    );
  }
}

const castTarget = {
  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      return;
    }
    const item = monitor.getItem();
    component.getWrappedInstance().handleCast(item);
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
  playCard: id => dispatch(playCard(id))
});

Cast = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(
  Cast
);

export default DropTarget(
  props => {
    return props.dragType;
  },
  castTarget,
  collect
)(Cast);
