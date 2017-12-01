import React, {Component} from "react";
import {DragSource} from 'react-dnd';

import "./Card.css";

class Card extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }

  render() {

    const {isDragging, connectDragSource} = this.props;

    return connectDragSource(
      <div id="card">
        <div id="mana">
          {this.props.mana}
        </div>
        <div id="name">
          {this.props.name}
        </div>
      </div>
    );

  }
}

const cardSource = {
  beginDrag(props) {
    return props;
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return;
    }
    const item = monitor.getItem();
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

export default DragSource("CARD", cardSource, collect)(Card);

