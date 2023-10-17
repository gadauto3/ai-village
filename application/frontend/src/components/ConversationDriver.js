import React, { useState, useRef, useEffect } from 'react';
import { GameState, deepCopy, iconsPath, makeMockLines, isLocalHost } from "./utils";

import "../css/ConversationDriver.css";
import { retrieveAdditionalConversation } from './APIService';

const ConversationDriver = ({ conversation, updateConversation, gameState, setGameState }) => {
  const [showCheckboxes, setShowCheckboxes] = useState(false);  // To show/hide checkboxes
  const [checkedIndex, setCheckedIndex] = useState(null);  // Index of the checked checkbox
  const linesContainerRef = useRef(null);

  const NOTICE_INDEX = 0;
  const NUM_BEFORE_API_CALL = 4;

  useEffect(() => {
    if (linesContainerRef.current) {
      linesContainerRef.current.scrollTop =
        linesContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  if (!conversation){
    return (
      <div className="conversation-driver"></div>
    );}

  const getIconPath = (name) => {
      const person = conversation.people.find(p => p.name === name);
      if (person && person.icon) {
          return `${iconsPath}/${person.icon}`;
      }
      return '';
  }

  const handleNextClick = () => {
    const nextIndex = conversation.currentLineIndex;

    if (nextIndex > NOTICE_INDEX) {
      setGameState(GameState.NOTICE_AI);
    }

    if (nextIndex === conversation.lines.length - NUM_BEFORE_API_CALL) {
      retrieveAdditionalConversation(conversation.lines, handleAPISuccess, handleAPIError);
    }
    incrementIndex();
  };

  const incrementIndex = () => {
    const updatedConvo = deepCopy(conversation);
    updatedConvo.currentLineIndex = conversation.currentLineIndex + 1;
    updateConversation(updatedConvo);
  }

  const handleNoticeClick = () => {
    if (gameState == GameState.NOTICE_AI){
      setGameState(GameState.SELECT_AI);
      setShowCheckboxes(true);
    } else {
      // Deep clone the current conversation to avoid direct state mutation
      const updatedLine = deepCopy(conversation.lines[checkedIndex]);
      const delta = Math.abs(conversation.initialLength - checkedIndex);
      const topScore = 15; // Todo: calculate
      conversation.aiResult = delta;
      updatedLine.message = `Your guess is ${delta} away from the answer. Score: ${conversation.initialLength - delta} of ${conversation.initialLength}`;
      conversation.lines[checkedIndex] = updatedLine;
      updateConversation(conversation);

      setCheckedIndex(null);
      setShowCheckboxes(false);
      setGameState(GameState.MOVE_CONVOS);
    }
  };

  const isNoticeDisabled = () => {
    return (gameState == GameState.SELECT_AI && checkedIndex == null) || 
      //TODO: update when change INDEX
      conversation.currentLineIndex < NOTICE_INDEX + 2;
  }

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
    if (isLocalHost()) {
      const moreLines = makeMockLines(conversation.lines);
      handleAPISuccess(moreLines);
    } else {
      console.log("retrieveConversations api error\n", err);
      alert("Sorry, failed to retrieve conversations due to an error, try refreshing.\n" + err);
    }
  };

  // INTERACT Stage functions

  const handleNextInteractClick = () => {
    const nextIndex = conversation.currentLineIndex;

    if (nextIndex == conversation.lines.length) {
      retrieveAdditionalConversation(conversation.lines, handleInteractAPISuccess, handleInteractAPIError);
    }

    incrementIndex();
  };

  const handleInteractAPISuccess = (moreLines) => {
    const newConvo = deepCopy(conversation);
    const convoLines = newConvo.lines;
    moreLines[0].message = `AI provided ${moreLines.length} more lines.`;
    convoLines.push(...moreLines);
    convoLines[conversation.initialLength].message = "AI-created conversation starts here";
    conversation.lines = convoLines;
    updateConversation(conversation);
  };

  const handleInteractAPIError = (err) => {
    if (isLocalHost()) {
      const moreLines = makeMockLines(conversation.lines);
      handleInteractAPISuccess(moreLines);
    } else {
      console.log("retrieveConversations api error\n", err);
      alert("Sorry, failed to retrieve conversations due to an error, try refreshing.\n" + err);
    }
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

      {gameState >= GameState.NEXT_CONVO && conversation.aiResult == null && (
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
            disabled={showCheckboxes}
          >
            Next
          </button>
          <button
            className="notice-button"
            onClick={handleNoticeClick}
            disabled={isNoticeDisabled()}
          >
            ⬆
          </button>
        </div>
      )}
    </div>
  );
}

export default ConversationDriver;
