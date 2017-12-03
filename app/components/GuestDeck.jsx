import React, {Component} from "react";

import "./GuestDeck.css";

export default class GuestDeck extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }

  render() {

    return (
      <div id="guestdeck">
        guestdeck
      </div>
    );

  }
}

