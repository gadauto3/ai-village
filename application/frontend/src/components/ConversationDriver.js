import React, { useState, useRef, useEffect } from 'react';
import { GameState, deepCopy, iconsPath, makeMockLines, isLocalHost } from "./utils";
import ScoreHandler from './ScoreHandler';

import "../css/ConversationDriver.css";
import { retrieveAdditionalConversation, retrieveAdditionalConversationWithUserInput } from './APIService';

const ConversationDriver = ({
  conversation,
  updateConversation,
  gameState,
  setGameState,
  userName,
  getUserName
}) => {
  const [showCheckboxes, setShowCheckboxes] = useState(false); // To show/hide checkboxes
  const [checkedIndex, setCheckedIndex] = useState(null); // Index of the checked checkbox
  const [isReadyToJoin, setIsReadyToJoin] = useState(false); // Ready to join the conversation
  const [numTalkTokens, setNumTalkTokens] = useState(NUM_TALK_TOKENS);
  const [userInput, setUserInput] = useState("");
  const [userInputError, setUserInputError] = useState(null);
  const linesContainerRef = useRef(null);

  const scoreHandler = ScoreHandler();
  const NOTICE_INDEX = 0;
  const NUM_BEFORE_API_CALL = 4;
  const NUM_TALK_TOKENS = 3;
  const AI_STARTS_HERE_MSG = "AI-created conversation starts here";

  useEffect(() => {
    if (linesContainerRef.current) {
      linesContainerRef.current.scrollTop =
        linesContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  if (!conversation) {
    return <div className="conversation-driver"></div>;
  }

  const getIconPath = (name) => {
    const person = conversation.people.find((p) => p.name === name);
    if (person && person.icon) {
      return `${iconsPath}/${person.icon}`;
    }
    return "";
  };

  const handleNextClick = () => {
    const nextIndex = conversation.currentLineIndex;

    if (nextIndex > NOTICE_INDEX) {
      setGameState(GameState.NOTICE_AI);
    }

    if (nextIndex === conversation.lines.length - NUM_BEFORE_API_CALL) {
      retrieveAdditionalConversation(
        conversation.lines,
        handleAPISuccess,
        handleAPIError
      );
    }
    incrementIndex();
  };

  const incrementIndex = () => {
    const updatedConvo = deepCopy(conversation);
    updatedConvo.currentLineIndex = conversation.currentLineIndex + 1;
    updateConversation(updatedConvo);
  };

  const handleNoticeClick = () => {
    if (gameState == GameState.NOTICE_AI) {
      setGameState(GameState.SELECT_AI);
      setShowCheckboxes(true);
    } else {
      // Deep clone the current conversation to avoid direct state mutation
      const updatedConvo = deepCopy(conversation);
      updatedConvo.aiGuess = checkedIndex;
      const updatedLine = updatedConvo.lines[checkedIndex];
      updatedLine.message = scoreHandler.calculateScoreMessage(
        checkedIndex,
        conversation.initialLength
      );
      updatedConvo.lines[checkedIndex] = updatedLine;
      if (conversation.lines.length > conversation.initialLength && checkedIndex != conversation.initialLength) {
        updatedConvo.lines[conversation.initialLength].message = AI_STARTS_HERE_MSG;
      }
      updateConversation(updatedConvo);

      setCheckedIndex(null);
      setShowCheckboxes(false);
      setGameState(GameState.MOVE_CONVOS);
    }
  };

  const isNoticeDisabled = () => {
    return (
      (gameState == GameState.SELECT_AI && checkedIndex == null) ||
      //TODO: update when change INDEX
      conversation.currentLineIndex < NOTICE_INDEX + 2
    );
  };

  const handleCheckboxChange = (index) => {
    setCheckedIndex(index);
  };

  // Handle API calls
  const handleAPISuccess = (moreLines) => {
    const convoLines = deepCopy(conversation.lines);
    convoLines.push(...moreLines);
    conversation.lines = convoLines;
    updateConversation(conversation);
  };

  const handleAPIError = (err) => {
    handleErrorWithLabel(err, handleAPISuccess);
  };

  const handleErrorWithLabel = (err, addLines, label = "") => {
    if (isLocalHost()) {
      const moreLines = makeMockLines(conversation.lines, label);
      addLines(moreLines);
    } else {
      console.log("retrieveConversations api error\n", err);
      alert(
        "Sorry, failed to retrieve conversations due to an error, try refreshing.\n" +
        err
      );
    }
  }

  // INTERACT Stage functions

  const handleNextInteractClick = () => {
    const nextIndex = conversation.currentLineIndex;

    if (nextIndex == conversation.lines.length - 1) {
      if (gameState === GameState.JOIN_CONVO) {
        setIsReadyToJoin(true);
      } else {
        retrieveAdditionalConversation(
          conversation.lines,
          handleInteractAPISuccess,
          handleInteractAPIError
        );
      }
    }

    incrementIndex();
  };

  const handleInteractAPISuccess = (moreLines) => {
    const newConvo = deepCopy(conversation);
    const convoLines = newConvo.lines;
    moreLines[0].message = `AI provided ${moreLines.length} more lines.`;
    convoLines.push(...moreLines);
    convoLines[conversation.initialLength].message = AI_STARTS_HERE_MSG;
    conversation.lines = convoLines;
    updateConversation(conversation);
  };

  const handleInteractAPIError = (err) => {
    if (isLocalHost()) {
      const moreLines = makeMockLines(conversation.lines);
      handleInteractAPISuccess(moreLines);
    } else {
      console.log("retrieveConversations api error\n", err);
      alert(
        "Sorry, failed to retrieve conversations due to an error, try refreshing.\n" +
          err
      );
    }
  };

  const handleJoinConvo = () => {
    setGameState(GameState.JOIN_CONVO);
  };

  const handleMessageSubmit = () => {
    console.log("playerName", userName, "lastPerson", "??lastPerson");
    const maxChars = 140;
    const entry = userInput.trim();
    const regex = /^[a-zA-Z0-9-. ,()'!?]+$/;
    let errorMessage = null;
    if (entry.length < 20) {
      errorMessage = `Please provide a longer sentence with more details, up to ${maxChars} characters.`;
    } else if (entry.length > maxChars) {
      errorMessage = `Sorry, please use less than ${maxChars} characters in your message. It is currently ${entry.length}.`;
    } else if (!regex.test(entry)) {
      errorMessage = `Please use only letters, numbers, .-,()'!? and space characters.`;
    } else if (!userName) {
      errorMessage = `Would you please provide a name?`;
      const peeps = conversation.people;
      getUserName({
        textToDisplay: `Please provide your name to ${peeps[0].name} and ${peeps[1].name}. Note: your name will be used only for this round of the game.`,
        buttonText: "Done",
        entryLengthMin: 3,
        entryLengthMax: 20,
        onClose: (name) => {
          console.log("name", name);;
          // TODO: call this function afterwards? Will that cause issues?
        }
      });
    }

    if (errorMessage) {
      setUserInputError(errorMessage);
      return;
    } else if (userInputError) {
      setUserInputError(null);
    }

    retrieveAdditionalConversationWithUserInput(
      userName,
      userInput,
      conversation.lines,
      handleInteractWithUserAPISuccess,
      handleInteractWithUserAPIError
    );
  };

  const handleInteractWithUserAPISuccess = (moreLines) => {
    handleInteractAPISuccess(moreLines);
    setGameState(GameState.INTERACT);
    setIsReadyToJoin(false);
    setUserInput("");
  }

  const handleInteractWithUserAPIError = (err) => {
    handleErrorWithLabel(err, handleInteractWithUserAPISuccess, "withUser");
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

      <div className="lines-container" ref={linesContainerRef}>
        {conversation.lines
          .slice(0, conversation.currentLineIndex + 1)
          .map((line, index) => (
            <div
              key={index}
              className={`line-item ${index === 0 ? "first" : ""}`}
            >
              {line.message && (
                <span className="line-message">{line.message}</span>
              )}

              <div className="line-content">
                <img src={getIconPath(line.name)} alt={line.name} />
                <div className="line-container">
                  <span>{line.text}</span>
                </div>
                {showCheckboxes && (
                  <input
                    type="checkbox"
                    className="line-checkbox"
                    checked={checkedIndex === index}
                    onChange={() => handleCheckboxChange(index)}
                  />
                )}
              </div>
            </div>
          ))}
      </div>

      {gameState >= GameState.NEXT_CONVO && conversation.aiGuess == null && (
        <div className="driver-buttons">
          <button
            className="next-button"
            onClick={handleNextClick}
            disabled={showCheckboxes}
          >
            Next
          </button>

          <button
            className="notice-button"
            onClick={handleNoticeClick}
            disabled={isNoticeDisabled()}
          >
            {gameState == GameState.SELECT_AI
              ? "Submit guess"
              : "I'm noticing AI generation"}
          </button>
        </div>
      )}

      {gameState >= GameState.INTERACT && (
        <div className="driver-buttons">
          <button
            className="next-button"
            onClick={handleNextInteractClick}
            disabled={showCheckboxes || isReadyToJoin}
          >
            Next
          </button>

          {gameState !== GameState.JOIN_CONVO && (
            <button className="notice-button" onClick={handleJoinConvo}>
              Join conversation
            </button>
          )}
          {isReadyToJoin && (
            <textarea
              rows="2"
              className="form-control spacing no-shadow"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter your message for the conversation here then click the arrow to submit..."
            ></textarea>
          )}
          {gameState === GameState.JOIN_CONVO && !isReadyToJoin && (
            <input
              type="text"
              className="middle-textfield"
              placeholder="👈🏽 Please continue the conversation."
              disabled={!isReadyToJoin}
            />
          )}
          {gameState === GameState.JOIN_CONVO && (
            <button
              className="up-button"
              disabled={!isReadyToJoin}
              onClick={handleMessageSubmit}
            >
              ⬆
            </button>
          )}
        </div>
      )}
      {userInputError && <div className="error-message">{userInputError}</div>}
    </div>
  );
};

export default ConversationDriver;
