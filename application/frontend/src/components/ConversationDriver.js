import React, { useState } from "react";
import { GameState, deepCopy, iconsPath } from "./utils";

import "../css/ConversationDriver.css";
import DriverIdentifyAI from "./DriverIdentifyAI";
import DriverInteractWithAI from "./DriverInteractWithAI";

const ConversationDriver = ({
  conversation,
  updateConversation,
  gameState,
  setGameState,
  userName,
  getUserName,
  isTutorial,
  tutorialState,
  setTutorialState,
  displayModal,
}) => {
  const [isFetching, setIsFetching] = useState(false); // Fetching from the API

  if (!conversation) {
    return <div className="conversation-driver"></div>;
  }

  const safeUpdateConversation = (updatedConversation) => {
    updateConversation(updatedConversation);
  };

  const updateConversationLines = (moreLines, currentConversation = null) => {
    const updatedConversation = currentConversation ?? deepCopy(conversation);
    if (!areLinesForThisConversation(moreLines, updatedConversation)) {
      return currentConversation ?? conversation;
    }

    updatedConversation.lines.push(...moreLines);
    safeUpdateConversation(updatedConversation);
    return updatedConversation;
  };

  const areLinesForThisConversation = (lines, conversationToCheck) => {
    const participantNames = conversationToCheck.people.map((person) => person.name);
    return lines.every((line) => participantNames.includes(line.name));
  };

  const incrementIndex = (conversationCopy = null) => {
    const updatedConversation = conversationCopy ?? deepCopy(conversation);
    updatedConversation.currentLineIndex = updatedConversation.currentLineIndex + 1;
    safeUpdateConversation(updatedConversation);
    return updatedConversation;
  };

  const getIconPath = (name) => {
    const person = conversation.people.find((person) => person.name === name);
    if (person && person.icon) {
      return `${iconsPath}${person.icon}`;
    }
    return '';
  };

  const fetchingName = () => {
    let penultimateLine = conversation.lines[conversation.lines.length - 2];
    if (penultimateLine.name === userName) {
      penultimateLine = conversation.lines[conversation.lines.length - 3];
    }
    return penultimateLine.name;
  };

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
          {...{
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
            displayModal,
          }}
          updateConversation={safeUpdateConversation}
        />
      ) : (
        <DriverInteractWithAI
          {...{
            conversation,
            gameState,
            setGameState,
            isFetching,
            setIsFetching,
            userName,
            getUserName,
            isTutorial,
            tutorialState,
            setTutorialState,
            updateConversationLines,
            incrementIndex,
            getIconPath,
            fetchingName,
          }}
          updateConversation={safeUpdateConversation}
        />
      )}
    </div>
  );
};

export default ConversationDriver;
