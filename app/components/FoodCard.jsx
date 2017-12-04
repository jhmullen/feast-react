import React, {Component} from "react";
import {DragSource} from 'react-dnd';

import "./FoodCard.css";

class FoodCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }

  render() {

    const {isDragging, connectDragSource} = this.props;

    return connectDragSource(
      <div id="foodcard">
        <div id="cost">
          {this.props.cost}
        </div>
        <div id="name">
          {this.props.name}
        </div>
        <div id="desc" style={{marginTop: "10px"}}>
          {this.props.desc}
        </div>
      </div>
    );

  }
}

const cardSource = {
  beginDrag(props) {
    return props;
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

export default DragSource((props) => {return props.dragType}, cardSource, collect)(FoodCard);

