import React, { Component } from "react";
import { DragSource } from "react-dnd";
import { connect } from "react-redux";
import { applyMana, moveGuest } from "../actions";

import "./GuestCard.css";

class GuestCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }

  render() {
    const { isDragging, connectDragSource } = this.props;

    return connectDragSource(
      <div id={this.props.compactMode ? "compactmode" : "guestcard"}>
        <div className="cost">
          <span>{`${this.props.cost}c/${this.props.appetite}a/${
            this.props.prestige
          }p`}</span>
          <span>{this.props.gameState.mana < this.props.cost ? "X" : ""}</span>
        </div>
        <div id="name">{this.props.name}</div>
        <div id="desc" style={{ marginTop: "10px" }}>
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

const mapStateToProps = state => ({ gameState: state.gameState });

const mapDispatchToProps = dispatch => ({
  applyMana: num => dispatch(applyMana(num)),
  moveGuest: (id, spot) => dispatch(moveGuest(id, spot))
});

GuestCard = connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true
})(GuestCard);

export default DragSource(
  props => {
    return props.dragType;
  },
  cardSource,
  collect
)(GuestCard);
