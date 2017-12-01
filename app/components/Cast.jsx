import React, {Component} from "react";
import { findDOMNode } from 'react-dom';
import { DropTarget } from 'react-dnd';

import "./Cast.css";

class Cast extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      mana: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isOver && nextProps.isOver) {
      // You can use this as enter handler
    }

    if (this.props.isOver && !nextProps.isOver) {
      // You can use this as leave handler
    }

    if (this.props.isOverCurrent && !nextProps.isOverCurrent) {
      // You can be more specific and track enter/leave
      // shallowly, not including nested targets
    }
  }

  render() {

    const {mana} = this.state;

    const {isOver, canDrop, connectDropTarget} = this.props;

    return connectDropTarget(
      <div id="cast" >
        <div id="cast-bg" className={isOver ? "fade" : null}>
        </div>
        <div id="counter">
          { `${mana} mana` }
        </div>
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
    console.log("dropped in a ", item);
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

export default DropTarget("CARD", castTarget, collect)(Cast);
