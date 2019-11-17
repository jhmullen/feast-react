import React, { Component } from "react";
import { connect } from "react-redux";
import { DropTarget } from "react-dnd";
import { applyMana, buyFood } from "../../actions";
import { Toaster, Position, Intent } from "@blueprintjs/core";

import "./Buy.css";

class Buy extends Component {
  handleBuy(card) {
    this.props.buyFood(card.id);
    const buyToast = Toaster.create({
      className: "buyToast",
      position: Position.TOP_CENTER
    });
    buyToast.show({
      message: `You Bought ${card.name}!`,
      intent: Intent.SUCCESS,
      timeout: 1500
    });
  }

  render() {
    const { isOver, canDrop, connectDropTarget } = this.props;

    return connectDropTarget(
      <div id="buy">
        <div id="buy-bg" className={isOver ? "fade" : null}>
          Buy
        </div>
      </div>
    );
  }
}

const buyTarget = {
  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      return;
    }
    const item = monitor.getItem();
    component.getWrappedInstance().handleBuy(item);
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
  buyFood: id => dispatch(buyFood(id))
});

Buy = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(
  Buy
);

export default DropTarget(
  props => {
    return props.dragType;
  },
  buyTarget,
  collect
)(Buy);
