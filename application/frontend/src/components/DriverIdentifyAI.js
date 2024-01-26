
import React, { useState, useRef, useEffect } from "react";
import { GameState, deepCopy, isLocalHost, makeMockLines } from "./utils";
import { retrieveAdditionalConversation } from "./APIService";

import ScoreHandler from "./ScoreHandler";
import AnimatedCircles from "./AnimatedCircles";
import { TutorialState, IM_NOTICING_INDEX } from "./Tutorial";
import { aiStartsHereMsg, earlyGuessAlert, errorLineText } from "./longStrings";

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
  displayModal,
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
      tutorialState === TutorialState.NEXT_BTN &&
      conversation &&
      conversation.currentLineIndex === IM_NOTICING_INDEX
    ) {
      setTutorialState(TutorialState.NOTICE_BTN);
      setGameState(GameState.NOTICE_AI);
    }

    conversationRef.current = incrementIndex();
  };

  const isNextBtnDisabled = () => {
    return (
      showCheckboxes ||
      isFetching ||
      conversation.isDone ||
      (isTutorial() && tutorialState === TutorialState.NOTICE_BTN)
    );
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

    const linesLength = conversation.lines.length;
    if (nextIndex === linesLength - NUM_BEFORE_API_CALL) {
      setIsFetchingForIdentify(true);
      isFetchingForIdentifyRef.current = true;
      conversationRef.current = conversation;
      retrieveAdditionalConversation(
        0,
        conversation.lines,
        handleAPISuccess,
        handleAPIError
      );
    }

    if (nextIndex === linesLength - 1) {
      if (isFetchingForIdentify) {
        setIsFetching(true);
      } else if (conversation.lines[linesLength - 1].text === errorLineText) {
        // Set the convo as done and ask player to move on
        const newConvo = deepCopy(conversation);
        newConvo.isDone = true;
        conversationRef.current = incrementIndex(newConvo);
        setGameState(GameState.MOVE_CONVOS);
      }
      return;
    }

    conversationRef.current = incrementIndex();
  };

  const handleNoticeClick = () => {
    if (
      gameState == GameState.NOTICE_AI ||
      gameState == GameState.MOVE_CONVOS
    ) {

      // Prevent people from clicking right when it appears
      if (conversation.currentLineIndex <= NOTICE_INDEX + 2 && !isLocalHost() &&
        // and this is not the last line
        conversation.currentLineIndex !== conversation.lines.length - 1
      ) {
        displayModal({ textToDisplay: earlyGuessAlert, buttonText: "Ok", onClose: () => {} });
        return;
      }

      setGameState(GameState.SELECT_AI);
      setShowCheckboxes(true);

      if (isTutorial()) {
        conversationRef.current = incrementIndex();
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
        conversationRef.current = incrementIndex(updatedConvo);
        setTutorialState(TutorialState.MOVE_ON);
      } else {
        conversationRef.current = updatedConvo;
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
    conversationRef.current = updateConversationLines(moreLines, conversationRef.current);
    cleanupFetchingBools();
  };

  const handleAPIError = (err) => {
    const linesLength = conversationRef.current.lines.length;
    if (isLocalHost() && linesLength <= 7) {
      const moreLines = makeMockLines(
        conversationRef.current.lines,
        "identify"
      );
      conversationRef.current = updateConversationLines(moreLines);
    } else if (conversationRef.current.lines[linesLength - 1].text !== errorLineText) {
      console.log("ERROR last line was: ", conversationRef.current.lines[linesLength - 1].text);
      // const newConvo = deepCopy(conversationRef.current);
      // const lastLine = { "name": fetchingName(), "text": errorLineText };
      // conversationRef.current = updateConversationLines([lastLine], newConvo);
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
  );
};

export default DriverIdentifyAI;