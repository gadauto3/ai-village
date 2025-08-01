import React, { useState, useMemo } from "react";
import { GameState } from "./utils";
import { useGameContext } from "../context/GameContext";

import useConversationState from "../hooks/useConversationState";
import useConversationValidation from "../hooks/useConversationValidation";
import useConversationUtils from "../hooks/useConversationUtils";
import ParticipantsList from "./ParticipantsList";

import "../css/ConversationDriver.css";
import DriverIdentifyAI from "./DriverIdentifyAI";
import DriverInteractWithAI from "./DriverInteractWithAI";

const ConversationDriver = () => {
  // Use GameContext for most props
  const {
    selectedConversation: conversation,
    updateConversation,
    gameState,
    setGameState,
    userName,
    isTutorial,
    tutorialState,
    setTutorialState,
    showNameModal,
    showGenericModal,
  } = useGameContext();
  const [isFetching, setIsFetching] = useState(false);

  // Initialize specialized hooks
  const conversationState = useConversationState({ conversation, updateConversation });
  const conversationValidation = useConversationValidation();
  const conversationUtils = useConversationUtils({ conversation, userName });

  // Enhanced updateConversationLines with validation
  const updateConversationLines = (moreLines, currentConversation = null) => {
    return conversationState.updateConversationLines(
      moreLines, 
      currentConversation, 
      conversationValidation.areLinesForThisConversation
    );
  };

  const sharedDriverProps = useMemo(() => ({
    conversation,
    gameState,
    setGameState,
    isFetching,
    setIsFetching,
    isTutorial,
    tutorialState,
    setTutorialState,
    updateConversationLines,
    incrementIndex: conversationState.incrementIndex,
    getIconPath: conversationUtils.getIconPath,
    fetchingName: conversationUtils.getFetchingName,
  }), [
    conversation,
    gameState,
    setGameState,
    isFetching,
    setIsFetching,
    isTutorial,
    tutorialState,
    setTutorialState,
    updateConversationLines,
    conversationState.incrementIndex,
    conversationUtils.getIconPath,
    conversationUtils.getFetchingName,
  ]);

  // Early return AFTER all hooks have been called
  if (!conversation) {
    return <div className="conversation-driver"></div>;
  }

  return (
    <div className="conversation-driver">
      <ParticipantsList participants={conversation.people} />

      {gameState < GameState.INTERACT ? (
        <DriverIdentifyAI
          {...sharedDriverProps}
          displayModal={showGenericModal}
          updateConversation={conversationState.safeUpdateConversation}
        />
      ) : (
        <DriverInteractWithAI
          {...sharedDriverProps}
          userName={userName}
          getUserName={showNameModal}
          updateConversation={conversationState.safeUpdateConversation}
        />
      )}
    </div>
  );
};

export default React.memo(ConversationDriver);
