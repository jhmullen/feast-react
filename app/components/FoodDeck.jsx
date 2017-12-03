import React, {Component} from "react";
import Card from "./Card";

import "./FoodDeck.css";

export default class FoodDeck extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      faceup: []
    };
  }

  componentDidMount() {
    this.populate();
  }

  populate() {
    const {faceup} = this.state;
    for (let i = 0; i < 4; i++) {
      const obj = {
        id: i,
        mana: Math.floor(Math.random() * 12) + 1,
        name: "Buy Me"
      }
      faceup.push(obj);
    }
    this.setState({faceup});
  }

  dropCard(card) {
    let {faceup} = this.state;
    faceup = faceup.filter(c => c.id != card.id);
    this.setState({faceup});
  }

  render() {

    const {faceup} = this.state;
    const faceupList = faceup.map(c => <li key={c.id} className="faceup-item"><Card dragType="buyCard" dropCard={this.dropCard.bind(this)} {...c} /></li>);

    return (
      <div id="fooddeck">
        <ul>
          {faceupList}
        </ul>
      </div>
    );

  }
}
