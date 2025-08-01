import React from "react";
import { GameState } from "./utils";
import { useGameContext } from "../context/GameContext";

import {
  InstructionsCelebrate,
  InstructionsInit,
  InstructionsInteract,
  InstructionsMoveConvos,
  InstructionsNextConvo,
  InstructionsNoticeAI2,
  InstructionsSelectAI,
  InstructionsEndGame,
  InstructionsJoinConvo,
  InstructionsError
} from "./longStrings";

const Instructions = () => {
  const { gameState } = useGameContext();
  
  const getInstructionsForState = (gameState) => {
    switch (gameState) {
      case GameState.NEXT_CONVO:
        return InstructionsNextConvo;
      case GameState.NOTICE_AI:
        return InstructionsNoticeAI2;
      case GameState.SELECT_AI:
        return InstructionsSelectAI;
      case GameState.MOVE_CONVOS:
        return InstructionsMoveConvos;
      case GameState.CELEBRATE:
        return InstructionsCelebrate;
      case GameState.INTERACT:
        return InstructionsInteract;
      case GameState.JOIN_CONVO:
        return InstructionsJoinConvo;
      case GameState.ERROR:
        return InstructionsError;
      case GameState.END_GAME:
        return InstructionsEndGame;
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

export default React.memo(Instructions);
