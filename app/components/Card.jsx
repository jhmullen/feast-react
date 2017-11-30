import React, {Component} from "react";

import "./Card.css";

export default class Card extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }

  componentDidMount() {

  }

  render() {

    return (
      <div id="card">
        <div id="cost">
          {this.props.cost}
        </div>
        <div id="name">
          {this.props.name}
        </div>
      </div>
    );

  }
}

