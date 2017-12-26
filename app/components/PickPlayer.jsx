import React from "react";
import {
  Button,
  Popover,
  PopoverInteractionKind,
  Position
} from "@blueprintjs/core";

/**
 * which player (of, currently, 2) are you?
 */
export const PickPlayer = ({ pickPlayer }) => (
  <div>
    Which player are you?
    <Button onClick={() => pickPlayer(1)}>1</Button>
    <Button onClick={() => pickPlayer(2)}>2</Button>
  </div>
);

export default PickPlayer;
