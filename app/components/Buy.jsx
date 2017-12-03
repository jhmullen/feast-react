import React, {Component} from "react";
import { findDOMNode } from 'react-dom';
import { DropTarget } from 'react-dnd';

import "./Buy.css";

class Buy extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false
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

  handleBuy(item) {
    console.log("bought", item);
  }

  render() {

    const {isOver, canDrop, connectDropTarget} = this.props;

    return connectDropTarget(
      <div id="buy" >
        <div id="buy-bg" className={isOver ? "fade" : null}>
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
    component.handleBuy(item);
    return(item);
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

export default DropTarget((props) => {return props.dragType}, buyTarget, collect)(Buy);
