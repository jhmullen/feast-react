import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { Popover, PopoverInteractionKind, Position } from "@blueprintjs/core";

import './FoodCard.css';

class FoodCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
    };
  }

  render() {
    const { isDragging, connectDragSource, mana, cost, position } = this.props;

    const canAfford = mana >= cost;

    return connectDragSource(
      <div>
        <Popover
          interactionKind={PopoverInteractionKind.HOVER}
          popoverClassName="pt-popover-content-sizing"
          position={position}
          hoverOpenDelay={800}
          hoverCloseDelay={100}
        >
          <div id="foodcard">
            <div className="cost">
              <span>{this.props.cost}</span>
              <span>{canAfford ? '' : 'X'}</span>
            </div>
            <div id="name">{this.props.name}</div>
            <div id="desc" style={{ marginTop: '10px' }}>
              {this.props.desc}
            </div>
          </div>
          <div id="foodcard-big">
            <div className="cost">
              <span>{this.props.cost}</span>
              <span>{canAfford ? '' : 'X'}</span>
            </div>
            <div id="name">{this.props.name}</div>
            <div id="desc" style={{ marginTop: '10px' }}>
              {this.props.desc}
            </div>
          </div>
        </Popover>
      </div>,
    );
  }
}

const cardSource = {
  beginDrag(props) {
    return props;
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

export default DragSource(
  props => {
    return props.dragType;
  },
  cardSource,
  collect,
)(FoodCard);
