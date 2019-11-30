import React, { Component } from "react";
import { connect } from "react-redux";

import { setMana, setPrestige } from "../../actions";
import { EditableText, Intent } from "@blueprintjs/core";

import "./ScorePanel.css";

class ScorePanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      manaIntent: Intent.NONE,
      prestigeIntent: Intent.NONE
    };
  }

  componentDidMount() {
    const playerId = this.props.opponent ? this.props.gameState.opponentId : this.props.gameState.playerId;
    const {mana, prestige} = this.props.gameState.players[playerId];
    this.setState({playerId, mana, prestige});
  }

  getIntent(diff) {
    return diff > 0 ? Intent.SUCCESS : diff < 0 ? Intent.DANGER : Intent.NONE;
  }

  componentDidUpdate(prevProps) {    
    const {playerId} = this.state;
    const prevPlayer = prevProps.gameState.players[playerId];
    const thisPlayer = this.props.gameState.players[playerId];
    ["mana", "prestige"].forEach(k => {
      if (prevPlayer[k] !== thisPlayer[k]) {
        const diff = thisPlayer[k] - prevPlayer[k];
        this.setState({[k]: thisPlayer[k], [`${k}Intent`]: this.getIntent(diff)});
        setTimeout(() => this.setState({[`${k}Intent`]: this.getIntent(0)}), 2000);
      }
    })
  }

  setPrestige() {
    const {prestige} = this.state;
    this.props.setPrestige(prestige);
  }

  setMana() {
    const {mana} = this.state;
    this.props.setMana(mana);
  }

  onChange(type, num) {
    if (!isNaN(num)){
      this.setState({[type]: Number(num)});
    }
  }

  render() {

    const {mana, prestige, manaIntent, prestigeIntent} = this.state;
    const {opponent} = this.props;

    if (mana === undefined || prestige === undefined) return null;

    return (
      <div className={`score-panel ${opponent ? "sp-opponent" : "sp-player"}`}>
        <span>Mana: </span>
        <EditableText
          value={mana}
          intent={manaIntent}
          disabled={opponent}
          onChange={this.onChange.bind(this, "mana")}
          onConfirm={this.setMana.bind(this)}
          selectAllOnFocus={true}
        />
        <br/>
        <span>Prestige: </span>
        <EditableText
          value={prestige}
          intent={prestigeIntent}
          disabled={opponent}
          onChange={this.onChange.bind(this, "prestige")}
          onConfirm={this.setPrestige.bind(this)}
          selectAllOnFocus={true}
        />
      </div>
    );
  }
}


const mapStateToProps = state => ({ gameState: state.gameState });

const mapDispatchToProps = dispatch => ({
  setMana: num => dispatch(setMana(num)),
  setPrestige: num => dispatch(setPrestige(num))
});

ScorePanel = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
  ScorePanel
);

export default ScorePanel;