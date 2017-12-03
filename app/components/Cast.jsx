import React, {Component} from "react";
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom';
import { DropTarget } from 'react-dnd';
import {applyMana, setHand} from '../actions'

import "./Cast.css";

class Cast extends Component {

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

  handleCast(card) {
    let {hand} = this.props.gameState;
    hand = hand.filter(c => c.id != card.id);
    this.props.applyMana(card.mana);
    this.props.setHand(hand);
  }

  render() {

    const {mana} = this.props.gameState;

    const {isOver, canDrop, connectDropTarget} = this.props;

    return connectDropTarget(
      <div id="cast" >
        <div id="cast-bg" className={isOver ? "fade" : null}>
          Cast
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
    component.getWrappedInstance().handleCast(item);
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

const mapStateToProps = state => {
  return { 
    gameState: state.gameState
  }
};

const mapDispatchToProps = dispatch => {
  return {
    applyMana: num => {
      dispatch(applyMana(num))
    },
    setHand: hand => {
      dispatch(setHand(hand))
    }
  }
};

Cast = connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(Cast); 

export default DropTarget((props) => {return props.dragType}, castTarget, collect)(Cast);
