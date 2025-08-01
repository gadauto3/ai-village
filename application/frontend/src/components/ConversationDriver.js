import React, { useState, useMemo, useCallback } from "react";
import { GameState, deepCopy, iconsPath } from "./utils";
import { useGameContext } from "../context/GameContext";

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
  const [isFetching, setIsFetching] = useState(false); // Fetching from the API

  // All hooks must be called before any conditional returns
  const safeUpdateConversation = useCallback((updatedConversation) => {
    updateConversation(updatedConversation);
  }, [updateConversation]);

  const areLinesForThisConversation = useCallback((lines, conversationToCheck) => {
    const participantNames = conversationToCheck.people.map((person) => person.name);
    return lines.every((line) => participantNames.includes(line.name));
  }, []);

  const updateConversationLines = useCallback((moreLines, currentConversation = null) => {
    if (!conversation) return null;
    const updatedConversation = currentConversation ?? deepCopy(conversation);
    if (!areLinesForThisConversation(moreLines, updatedConversation)) {
      return currentConversation ?? conversation;
    }

    updatedConversation.lines.push(...moreLines);
    safeUpdateConversation(updatedConversation);
    return updatedConversation;
  }, [conversation, safeUpdateConversation, areLinesForThisConversation]);

  const incrementIndex = useCallback((conversationCopy = null) => {
    if (!conversation) return null;
    const updatedConversation = conversationCopy ?? deepCopy(conversation);
    updatedConversation.currentLineIndex = updatedConversation.currentLineIndex + 1;
    safeUpdateConversation(updatedConversation);
    return updatedConversation;
  }, [conversation, safeUpdateConversation]);

  const getIconPath = useCallback((name) => {
    if (!conversation) return '';
    const person = conversation.people.find((person) => person.name === name);
    if (person && person.icon) {
      return `${iconsPath}${person.icon}`;
    }
    return '';
  }, [conversation]);

  const fetchingName = useCallback(() => {
    if (!conversation || !conversation.lines || conversation.lines.length < 2) return '';
    let penultimateLine = conversation.lines[conversation.lines.length - 2];
    if (penultimateLine.name === userName) {
      penultimateLine = conversation.lines[conversation.lines.length - 3];
    }
    return penultimateLine.name;
  }, [conversation, userName]);

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
    incrementIndex,
    getIconPath,
    fetchingName,
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
    incrementIndex,
    getIconPath,
    fetchingName,
  ]);

  // Early return AFTER all hooks have been called
  if (!conversation) {
    return <div className="conversation-driver"></div>;
  }

  return (
    <div className="conversation-driver">
      <div className="participants">
        <span className="to-label">To:</span>
        {conversation.people.map((person, index) => (
          <span
            key={index}
            className={`participant ${index === 0 ? "first" : ""}`}
          >
            {person.name}
            {index < conversation.people.length - 1 && ", "}
          </span>
        ))}
      </div>

      {gameState < GameState.INTERACT ? (
        <DriverIdentifyAI
          {...sharedDriverProps}
          displayModal={showGenericModal}
          updateConversation={safeUpdateConversation}
        />
      ) : (
        <DriverInteractWithAI
          {...sharedDriverProps}
          userName={userName}
          getUserName={showNameModal}
          updateConversation={safeUpdateConversation}
        />
      )}
    </div>
  );
};

export default React.memo(ConversationDriver);
