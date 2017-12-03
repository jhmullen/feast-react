import React, {Component} from "react";
import {connect} from "react-redux";
import {findDOMNode} from "react-dom";
import {DropTarget} from "react-dnd";
import {applyMana, setFaceupFood} from "../actions";
import {Toaster, Position, Intent} from "@blueprintjs/core";

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

  handleBuy(card) {
    const {mana, faceup_food} = this.props.gameState;
    const buyToast = Toaster.create({className: "buyToast", position: Position.TOP_CENTER});
    if (card.mana < mana) {
      const pruned = faceup_food.filter(f => f.id !== card.id);
      this.props.applyMana(-card.mana);
      this.props.setFaceupFood(pruned);
      buyToast.show({message: `You bought ${card.name}!`, intent: Intent.SUCCESS, timeout: 1500});
    } 
    else {
      buyToast.show({message: `Not Enough Mana!`, intent: Intent.DANGER, timeout: 1500});
    }
  }

  render() {

    const {isOver, canDrop, connectDropTarget} = this.props;

    return connectDropTarget(
      <div id="buy" >
        <div id="buy-bg" className={isOver ? "fade" : null}>
          Buy
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
    component.getWrappedInstance().handleBuy(item);
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
    setFaceupFood: faceup_food => {
      dispatch(setFaceupFood(faceup_food))
    }
  }
};

Buy = connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(Buy); 

export default DropTarget((props) => {return props.dragType}, buyTarget, collect)(Buy);
