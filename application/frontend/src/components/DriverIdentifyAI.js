
import React, { useState, useRef, useEffect } from "react";
import { GameState, deepCopy, isLocalHost, makeMockLines } from "./utils";
import { retrieveAdditionalConversation } from "./APIService";

import ScoreHandler from "./ScoreHandler";
import AnimatedCircles from "./AnimatedCircles";
import { TutorialState, IM_NOTICING_INDEX } from "./Tutorial";
import { aiStartsHereMsg } from "./longStrings";

import "../css/DriverIdentifyAI.css"

const DriverIdentifyAI = ({
  conversation,
  updateConversation,
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
}) => {
  const [isFetchingForIdentify, setIsFetchingForIdentify] = useState(false); // Fetching from the API
  const [showCheckboxes, setShowCheckboxes] = useState(false); // To show/hide checkboxes
  const [checkedIndex, setCheckedIndex] = useState(null); // Index of the checked checkbox

  const linesContainerRef = useRef(null);
  const conversationRef = useRef(conversation);
  const isFetchingForIdentifyRef = useRef(isFetchingForIdentify);
  const scoreHandler = ScoreHandler();

  const NOTICE_INDEX = 2;
  const NUM_BEFORE_API_CALL = 4;

  useEffect(() => {
    if (linesContainerRef.current) {
      linesContainerRef.current.scrollTop =
        linesContainerRef.current.scrollHeight;
    }
  }, [conversation, isFetching]);

  const handleTutorialNext = () => {
    if (tutorialState === TutorialState.WAITING) {
      setTutorialState(TutorialState.NEXT_BTN);
    } else if (
      tutorialState === TutorialState.NEXT_BTN && conversation &&
      conversation.currentLineIndex === IM_NOTICING_INDEX
    ) {
      setTutorialState(TutorialState.NOTICE_BTN);
      setGameState(GameState.NOTICE_AI);
    }

    incrementIndex();
  };

  const isNextBtnDisabled = () => {
    return showCheckboxes || isFetching ||
      (isTutorial() && tutorialState === TutorialState.NOTICE_BTN);
  };

  const handleNextClick = () => {
    const nextIndex = conversation.currentLineIndex;

    if (isTutorial()) {
      handleTutorialNext();
      return;
    }

    if (nextIndex >= NOTICE_INDEX) {
      setGameState(GameState.NOTICE_AI);
    }

    if (nextIndex === conversation.lines.length - NUM_BEFORE_API_CALL) {
      setIsFetchingForIdentify(true);
      isFetchingForIdentifyRef.current = true;
      conversationRef.current = conversation;
      retrieveAdditionalConversation(
        conversation.lines,
        handleAPISuccess,
        handleAPIError
      );
    }

    if (nextIndex === conversation.lines.length) {
      if (isFetchingForIdentify) {
        setIsFetching(true);
        isFetchingRef.current = true;
      }
      return;
    }

    incrementIndex();
  };

  const handleNoticeClick = () => {
    if (gameState == GameState.NOTICE_AI || gameState == GameState.MOVE_CONVOS) {
      setGameState(GameState.SELECT_AI);
      setShowCheckboxes(true);

      if (isTutorial()) {
        incrementIndex();
      }
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
      
      if (
        conversation.lines.length > conversation.initialLength &&
        checkedIndex != conversation.initialLength
      ) {
        updatedConvo.lines[conversation.initialLength].message =
          aiStartsHereMsg;
      }

      if (isTutorial()) {
        updatedLine.message = "You did it!";
        incrementIndex(updatedConvo);
        setTutorialState(TutorialState.MOVE_ON);
      } else {
        updateConversation(updatedConvo);
      }

      setCheckedIndex(null);
      setShowCheckboxes(false);
      setGameState(GameState.MOVE_CONVOS);
    }
  };

  const isNoticeDisabled = () => {
    return (
      gameState < GameState.NOTICE_AI ||
      conversation.currentLineIndex < NOTICE_INDEX ||
      (gameState == GameState.SELECT_AI && checkedIndex == null) ||
      isFetching ||
      (isTutorial() && tutorialState === TutorialState.NEXT_BTN)
    );
  };

  const handleCheckboxChange = (index) => {
    setCheckedIndex(index);
  };

  // Handle API calls
  const handleAPISuccess = (moreLines) => {
    updateConversationLines(moreLines, conversationRef.current);
    cleanupFetchingBools();
  };

  const handleAPIError = (err) => {
    if (isLocalHost()) {
      const moreLines = makeMockLines(conversationRef.current.lines, "identify");
      updateConversationLines(moreLines);
    } else {
      console.log("retrieveConversations api error\n", err);
      alert(retrieveConvoError + err);
    }
    cleanupFetchingBools();
  };

  const cleanupFetchingBools = () => {
    setIsFetchingForIdentify(false);
    isFetchingForIdentifyRef.current = false;
    setIsFetching(false);
  };

  return (
    <div className="driver-identify">
      <div className="lines-container" ref={linesContainerRef}>
        {conversation.lines
          .slice(0, conversation.currentLineIndex + 1)
          .map((line, index) => (
            <div
              key={index}
              className={`line-item 
            ${index === 0 ? "first" : ""}`}
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

          {isFetching && (
            <div className="line-content">
              <img
                className="margin-left"
                src={getIconPath(fetchingName())}
                alt={fetchingName()}
              />
              <AnimatedCircles />
            </div>
          )}
      </div>

      {gameState >= GameState.NEXT_CONVO &&
        gameState < GameState.CELEBRATE &&
        conversation.aiGuess == null && (
          <div className="driver-buttons">
            <button
              className="next-button"
              onClick={handleNextClick}
              disabled={isNextBtnDisabled()}
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

    </div>
)};

export default DriverIdentifyAI;