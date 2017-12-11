import React, { Component } from "react";
import { connect } from "react-redux";
import { applyMana } from "../actions";
import { Icon, Button, Popover, PopoverInteractionKind, Position } from "@blueprintjs/core";
import FoodCard from "./FoodCard.jsx";

import "./DeckOps.css";

class DeckOps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }

  render() {
    const { position } = this.props;
    const { myDeck } = this.props.gameState;

    const cardList = myDeck.map(c => 
      <FoodCard 
        key={c.id} 
        compact={true}
        className="hand-item" 
        dragType="handCard" 
        position={Position.RIGHT}
        {...c} 
      />);

    return (
      <div id="deckops">
        <Popover
          interactionKind={PopoverInteractionKind.CLICK}
          popoverClassName="pt-popover-content-sizing"
          position={position}
          hoverOpenDelay={800}
          hoverCloseDelay={100}
        >
          <Button><Icon iconName="layers" /></Button>
          <div>
            {cardList}
            
          </div>
        </Popover>
      </div>
    );
  }
}

const mapStateToProps = state => ({ gameState: state.gameState });

const mapDispatchToProps = dispatch => ({
  applyMana: num => dispatch(applyMana(num))
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true
})(DeckOps);
