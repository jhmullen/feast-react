import React, {Component} from "react";

import "./Party.css";

export default class Party extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }

  render() {

    return (
      <div id="party">
        party
      </div>
    );

  }
}

