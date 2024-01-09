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

  /** Update Conversation parameters */
  const safeUpdateConversation = (updatedConvo) => {
    updateConversation(updatedConvo);
  };

  const updateConversationLines = (moreLines, currConvo = null) => {
    const updatedConvo = currConvo ?? deepCopy(conversation);
    updatedConvo.numApiCalls++;
    updatedConvo.lines.push(...moreLines);
    safeUpdateConversation(updatedConvo);
    return updatedConvo;
  };

  const incrementIndex = (convoCopy = null) => {
    const updatedConvo = convoCopy ?? deepCopy(conversation);
    updatedConvo.currentLineIndex = updatedConvo.currentLineIndex + 1;
    safeUpdateConversation(updatedConvo);
    return updatedConvo;
  };

  const getIconPath = (name) => {
    const person = conversation.people.find((p) => p.name === name);
    if (person && person.icon) {
      return `${iconsPath}${person.icon}`;
    }
    return "";
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
