import React from "react";
import { GameState } from "./utils";

import {
  InstructionsInit,
  InstructionsInteract,
  InstructionsMoveConvos,
  InstructionsNextConvo,
  InstructionsNoticeAI2,
  InstructionsSelectAI,
  InstructionsShowCredits,
} from "./longStrings";

const Instructions = (gameState) => {
  const getInstructionsForState = (gameState) => {
    switch (gameState.gameState) {
      case GameState.NEXT_CONVO:
        return InstructionsNextConvo;
      case GameState.NOTICE_AI:
        return InstructionsNoticeAI2;
      case GameState.SELECT_AI:
        return InstructionsSelectAI;
      case GameState.MOVE_CONVOS:
        return InstructionsMoveConvos;
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
