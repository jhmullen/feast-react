import React, { Component } from "react";
import { connect } from "react-redux";
import { applyMana, addGuest } from "../actions";
import { DropTarget } from "react-dnd";
import { Icon } from "@blueprintjs/core";

import "./TableSpot.css";

class TableSpot extends Component {

  handleInvite(guest) {
    this.props.addGuest(guest.id, this.props.spotNum);
  }

  render() {
    const { spotNum } = this.props;
    const { isOver, canDrop, connectDropTarget } = this.props;

    return connectDropTarget(<div id="tablespot"><Icon style={{color: "black"}} iconName="add" /> {spotNum + 1}</div>);
  }
}

const tableTarget = {
  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      return;
    }
    const item = monitor.getItem();
    component.getWrappedInstance().handleInvite(item);
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
  addGuest: (id, spot) => dispatch(addGuest(id, spot))
});

TableSpot = connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true
})(TableSpot);

export default DropTarget(
  props => {
    return props.dragType;
  },
  tableTarget,
  collect
)(TableSpot);
