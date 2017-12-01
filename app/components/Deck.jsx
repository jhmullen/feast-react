import React, {Component} from "react";

import "./Deck.css";

export default class Deck extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      remaining: 5,
      cardID: 0
    };
  }

  onClick(e) {
    let {remaining, cardID} = this.state;
    if (remaining > 0) {
      const card = {
        id: cardID,
        name: "Turkey Leg",
        mana: Math.floor(Math.random() * 12)
      }
      remaining--;
      cardID++
      if (this.props.onClick) this.props.onClick(card);
      this.setState({remaining, cardID});
    }
  }

  render() {

    const {remaining} = this.state;

    return (
      <div id="deck" onClick={this.onClick.bind(this)} >
        <div id="image-bg">
          { /* css background-image */ }
        </div>
        <div id="counter">
          { `${remaining} remaining` }
        </div>
      </div>
    );

  }
}

