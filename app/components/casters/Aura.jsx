import React, { Component } from "react";
import { connect } from "react-redux";
import { DropTarget } from "react-dnd";
import { setAura } from "../../actions";
import { Toaster, Position, Intent } from "@blueprintjs/core";
import DeckOps from "../ops/DeckOps";

import "./Aura.css";

class Aura extends Component {
  handleAura(card) {
    this.props.setAura(card.id);
  }

  render() {
    const { aura } = this.props.gameState;

    const { isOver, canDrop, connectDropTarget } = this.props;

    return connectDropTarget(
      <div id="aura">
        <div id="aura-bg" className={isOver ? "fade" : null}>
          Aura<br />
          <DeckOps
            deck={aura}
            position={Position.TOP}
            deckname="aura"
            dragType="handCard"
          />
        </div>
        <div id="counter">{`${aura.length} in aura`}</div>
      </div>
    );
  }
}

const auraTarget = {
  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      return;
    }
    const item = monitor.getItem();
    component.getWrappedInstance().handleAura(item);
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
  setAura: id => dispatch(setAura(id))
});

Aura = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(
  Aura
);

export default DropTarget(
  props => {
    return props.dragType;
  },
  auraTarget,
  collect
)(Aura);
