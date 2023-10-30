import React, { useState, useRef, useEffect } from "react";
import { GameState, deepCopy, iconsPath } from "./utils";

import "../css/ConversationDriver.css";
import {
  retrieveAdditionalConversation,
  retrieveAdditionalConversationWithUserInput,
} from "./APIService";
import { retrieveConvoError, aiStartsHereMsg } from "./longStrings";
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
}) => {
  const [isReadyToJoin, setIsReadyToJoin] = useState(false); // Ready to join the conversation
  const [isFetching, setIsFetching] = useState(false); // Fetching from the API
  const [userInput, setUserInput] = useState("");
  const [userInputError, setUserInputError] = useState(null);
  const [hasUserJoined, setHasUserJoined] = useState(false); // Whether user has joined the convo

  const isFetchingRef = useRef(isFetching);
  const currentLineIndexRef = useRef(0);
  const conversationRef = useRef(conversation);

  if (!conversation) {
    return <div className="conversation-driver"></div>;
  } else {
    currentLineIndexRef.current = conversation.currentLineIndex;
  }

  /** Update Conversation parameters */
  const safeUpdateConversation = (updatedConvo) => {
    console.log("Update conv", updatedConvo.lines.length, updatedConvo.people[0].name);
    updateConversation(updatedConvo);
  };

  const updateConversationLines = (moreLines, currConvo = null) => {
    const convo = currConvo ?? deepCopy(conversation);
    convo.lines.push(...moreLines);
    safeUpdateConversation(convo);
  };

  const incrementIndex = (convoCopy = null) => {
    const updatedConvo = convoCopy ?? deepCopy(conversation);
    updatedConvo.currentLineIndex = updatedConvo.currentLineIndex + 1;
    safeUpdateConversation(updatedConvo);
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
            incrementIndex,
            updateConversationLines,
            incrementIndex,
            getIconPath,
            fetchingName,
          }
        }
        updateConversation={safeUpdateConversation}
        />
      ) : (
        <DriverInteractWithAI {...{ isFetching, gameState, conversation }} />
      )}
    </div>
  );
};

export default ConversationDriver;
