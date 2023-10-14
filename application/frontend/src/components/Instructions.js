import React from "react";
import { GameState } from "./utils";

import {
  InstructionsInit,
  InstructionsInteract,
  InstructionsNoticeAI2,
  InstructionsShowCredits,
} from "./longStrings";

const Instructions = (gameState) => {
  const getInstructionsForState = (gameState) => {
    console.log("gameState", gameState);
    switch (gameState.gameState) {
      case GameState.NOTICE_AI:
        return InstructionsNoticeAI2;
      case GameState.INTERACT:
        return InstructionsInteract;
      case GameState.SHOW_CREDITS:
        return InstructionsShowCredits;
      default:
        return InstructionsInit; // default or initial state
    }
  };

  return (
    <div className="instructions">
      <p>
        <strong>Instructions: </strong>
        {getInstructionsForState(gameState)}
      </p>
    </div>
  );
};

export default Instructions;
