import React, { Component } from "react";
import { DragSource } from "react-dnd";
import { connect } from "react-redux";
import { applyMana } from "../actions";
import { Popover, PopoverInteractionKind, Position } from "@blueprintjs/core";

import "./GuestCard.css";

class GuestCard extends Component {

  render() {
    const { isDragging, connectDragSource, position, compact } = this.props;

    return connectDragSource(
      <div>
        <Popover
            interactionKind={PopoverInteractionKind.HOVER}
            popoverClassName="pt-popover-content-sizing"
            position={position}
            hoverOpenDelay={800}
            hoverCloseDelay={100}
        >
        { compact 
          ?
          <div id="guest-compact">
              <div id="name">{this.props.name}</div>
          </div>
          :
          <div id="guestcard">
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
        }
          <div id="guestcard-big">
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
        </Popover>
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
  applyMana: num => dispatch(applyMana(num))
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
