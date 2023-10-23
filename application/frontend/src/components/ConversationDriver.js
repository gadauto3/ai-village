import React, { useState, useRef, useEffect } from "react";
import {
  GameState,
  deepCopy,
  iconsPath,
  makeMockLines,
  isLocalHost,
} from "./utils";
import AnimatedCircles from "./AnimatedCircles";
import ScoreHandler from "./ScoreHandler";

import "../css/ConversationDriver.css";
import {
  retrieveAdditionalConversation,
  retrieveAdditionalConversationWithUserInput,
} from "./APIService";
import { AI_CONVO_INDEX, IM_NOTICING_INDEX, TutorialState } from "./Tutorial";

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
  const [showCheckboxes, setShowCheckboxes] = useState(false); // To show/hide checkboxes
  const [checkedIndex, setCheckedIndex] = useState(null); // Index of the checked checkbox
  const [isReadyToJoin, setIsReadyToJoin] = useState(false); // Ready to join the conversation
  const [isFetchingForGuess, setIsFetchingForGuess] = useState(false); // Fetching from the API
  const [isFetching, setIsFetching] = useState(false); // Fetching from the API
  const [numTalkTokens, setNumTalkTokens] = useState(NUM_TALK_TOKENS);
  const [userInput, setUserInput] = useState("");
  const [userInputError, setUserInputError] = useState(null);
  const [hasUserJoined, setHasUserJoined] = useState(false); // Whether user has joined the convo
  const linesContainerRef = useRef(null);

  const isFetchingRef = useRef(isFetching);
  const isFetchingForGuessRef = useRef(isFetchingForGuess);
  const currentLineIndexRef = useRef(0);
  const conversationRef = useRef(conversation);

  const scoreHandler = ScoreHandler();
  const NOTICE_INDEX = 2;
  const NUM_BEFORE_API_CALL = 4;
  const NUM_TALK_TOKENS = 3;
  const AI_STARTS_HERE_MSG = "AI-created conversation starts here";

  useEffect(() => {
    if (linesContainerRef.current) {
      linesContainerRef.current.scrollTop =
        linesContainerRef.current.scrollHeight;
    }
  }, [conversation, isFetching]);

  if (!conversation) {
    return <div className="conversation-driver"></div>;
  } else {
    currentLineIndexRef.current = conversation.currentLineIndex;
  }

  const getIconPath = (name) => {
    const person = conversation.people.find((p) => p.name === name);
    if (person && person.icon) {
      return `${iconsPath}${person.icon}`;
    }
    return "";
  };

  const handleTutorialNext = () => {
    if (tutorialState === TutorialState.WAITING) {
      setTutorialState(TutorialState.NEXT_BTN);
    } else if (
      tutorialState === TutorialState.NEXT_BTN &&
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

    if (nextIndex > NOTICE_INDEX) {
      setGameState(GameState.NOTICE_AI);
    }

    if (
      nextIndex === conversation.lines.length - NUM_BEFORE_API_CALL &&
      !isTutorial() // REDUNDANT? ^^^
    ) {
      setIsFetchingForGuess(true);
      isFetchingForGuessRef.current = true;
      conversationRef.current = conversation;
      retrieveAdditionalConversation(
        conversation.lines,
        handleAPISuccess,
        handleAPIError
      );
    }

    if (nextIndex === conversation.lines.length) {
      if (isFetchingForGuess) {
        setIsFetching(true);
        isFetchingRef.current = true;
      }
      return;
    }

    incrementIndex();
  };

  const incrementIndex = (convoCopy = null) => {
    const updatedConvo = convoCopy == null ? deepCopy(conversation) : convoCopy;
    updatedConvo.currentLineIndex = updatedConvo.currentLineIndex + 1;
    updateConversation(updatedConvo);
    currentLineIndexRef.current = updatedConvo.currentLineIndex;
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
          AI_STARTS_HERE_MSG;
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
      (gameState == GameState.SELECT_AI && checkedIndex == null) ||
      //TODO: update when change INDEX
      conversation.currentLineIndex < NOTICE_INDEX ||
      isFetching ||
      (isTutorial() && tutorialState === TutorialState.NEXT_BTN)
    );
  };

  const handleCheckboxChange = (index) => {
    setCheckedIndex(index);
  };

  // Handle API calls
  const handleAPISuccess = (moreLines) => {
    const convo = deepCopy(conversationRef.current);
    // This async call is holding onto state from when retrieve was called
    convo.currentLineIndex = currentLineIndexRef.current;
    convo.lines.push(...moreLines);
    updateConversation(convo);

    setIsFetchingForGuess(false);
    setIsFetching(false);
  };

  const handleAPIError = (err) => {
    handleErrorWithLabel(err, handleAPISuccess);
  };

  const handleErrorWithLabel = (err, addLines, label = "") => {
    if (isLocalHost()) {
      const moreLines = makeMockLines(
        filterLinesByName(conversationRef.current.lines, userName),
        label
      );
      addLines(moreLines);
    } else {
      console.log("retrieveConversations api error\n", err);
      alert(
        "Sorry, failed to retrieve conversations due to an error, \
        try pressing again or if that fails, refresh the page.\n" + err
      );
    }

    setIsFetchingForGuess(false);
    setIsFetching(false);
  };

  // INTERACT Stage functions
  const handleTutorialAPISuccess = (moreLines) => {
    // Split the lines before and after the AI index
    const convoLines = conversationRef.current.lines;
    const tutorialEndLines = convoLines.splice(AI_CONVO_INDEX + 1);
    const tutorialSoFarLines = convoLines.splice(0, AI_CONVO_INDEX + 1);

    moreLines.push(...tutorialEndLines);
    tutorialSoFarLines.push(...moreLines);
    const newConvo = deepCopy(conversationRef.current);
    newConvo.lines = tutorialSoFarLines;
    conversationRef.current = newConvo;
    incrementIndex(newConvo);

    setIsFetching(false);
  };

  const handleTutorialAPIFailure = (err) => {
    if (isLocalHost()) {
      const moreLines = makeMockLines(tutorialSoFarLines, "tutorial");
      handleTutorialAPISuccess(moreLines);
    }
  };

  const handleNextInteractTutorialClick = () => {
    
    if (conversation.currentLineIndex === AI_CONVO_INDEX - 1) {
      setTutorialState(TutorialState.SEE_AI);

      setIsFetching(true);
      isFetchingRef.current = true;
      conversationRef.current = conversation;
      retrieveAdditionalConversation(
        conversation.lines,
        handleTutorialAPISuccess,
        handleTutorialAPIFailure
      );
    } else if (conversation.currentLineIndex === conversation.lines.length - 1) {
      setTutorialState(TutorialState.DONE);
    }

    incrementIndex();
  };

  const handleNextInteractClick = () => {
    const nextIndex = conversation.currentLineIndex;

    if (isTutorial()) {
      handleNextInteractTutorialClick();
      return;
    }

    if (nextIndex == conversation.lines.length - 1) {
      if (gameState === GameState.JOIN_CONVO) {
        setIsReadyToJoin(true);
      } else {
        setIsFetching(true);
        isFetchingRef.current = true;
        conversationRef.current = conversation;
        retrieveAdditionalConversation(
          filterLinesByName(conversation.lines, userName),
          handleInteractAPISuccess,
          handleInteractAPIError
        );
      }
    }

    incrementIndex();
  };

  const handleInteractAPISuccess = (moreLines) => {
    if (!moreLines.length) {
      handleInteractAPIError("More lines were not added.");
      return;
    }

    const newConvo = deepCopy(conversationRef.current);
    // This async call is holding onto state from when retrieve was called
    newConvo.currentLineIndex = currentLineIndexRef.current;
    const convoLines = newConvo.lines;
    moreLines[0].message = `AI provided ${moreLines.length} more lines.`;
    convoLines.push(...moreLines);

    // Find the first AI line that may be after the user's line
    const firstAILine = newConvo.initialLength;
    if (convoLines.length > firstAILine && checkedIndex != firstAILine) {
      let msgIndex = firstAILine;
      if (convoLines[firstAILine].name === userName) {
        msgIndex++;
      }
      convoLines[msgIndex].message = AI_STARTS_HERE_MSG + `, added ${moreLines.length} lines.`;
    }

    newConvo.lines = convoLines;
    updateConversation(newConvo);

    setIsFetching(false);
  };

  const handleInteractAPIError = (err) => {
    if (isLocalHost()) {
      const moreLines = makeMockLines(
        filterLinesByName(conversation.lines, userName)
      );
      handleInteractAPISuccess(moreLines);
    } else {
      handleErrorWithLabel(err, null, "fromInteract");
    }
  };

  const handleJoinConvo = () => {
    setGameState(GameState.JOIN_CONVO);
  };

  const handleMessageSubmit = () => {
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
        onClose: () => {},
      });
    }

    // Check for and handle errors
    if (errorMessage) {
      setUserInputError(errorMessage);
      return;
    } else if (userInputError) {
      setUserInputError(null);
    }

    // Add lines to the conversation
    const newConvo = deepCopy(conversation);
    newConvo.lines.push({ name: userName, message: null, text: userInput });
    incrementIndex(newConvo);
    conversationRef.current = newConvo;
    setHasUserJoined(true);

    // Set fetching state and make the api call
    setIsFetching(true);
    isFetchingRef.current = true;
    retrieveAdditionalConversationWithUserInput(
      userName,
      userInput,
      filterLinesByName(conversation.lines, userName),
      handleInteractWithUserAPISuccess,
      handleInteractWithUserAPIError
    );
  };

  const filterLinesByName = (lines, name) => {
    return lines.filter((line) => line.name !== name);
  };

  const handleInteractWithUserAPISuccess = (moreLines) => {
    handleInteractAPISuccess(moreLines);
    cleanupUserInteraction();
  };

  const handleInteractWithUserAPIError = (err) => {
    handleErrorWithLabel(err, handleInteractWithUserAPISuccess, "withUser");
    cleanupUserInteraction();
  };

  const cleanupUserInteraction = () => {
    setGameState(GameState.INTERACT);
    setIsReadyToJoin(false);
    setUserInput("");
  };

  const fetchingName = () => {
    let penultimateLine = conversation.lines[conversation.lines.length - 2];
    if (penultimateLine.name === userName) {
      penultimateLine = conversation.lines[conversation.lines.length - 3];
    }
    return penultimateLine.name;
  };

  const getClassForPlayerState = (nameForLine) => {
    if (hasUserJoined) {
      if (nameForLine === userName) {
        return "player-line";
      } else {
        return "player-separator";
      }
    }
    return "";
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
              className={`line-item 
                ${index === 0 ? "first" : ""} 
                ${getClassForPlayerState(line.name)}`}
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

      {gameState >= GameState.INTERACT && (
        <div className="driver-buttons">
          <button
            className="next-button"
            onClick={handleNextInteractClick}
            disabled={isReadyToJoin || isFetching}
          >
            Next
          </button>

          {gameState !== GameState.JOIN_CONVO && (
            <button
              className="notice-button"
              onClick={handleJoinConvo}
              disabled={isTutorial() || conversation.key == 0} // TODO: more tutorial needed
            >
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
              disabled={!isReadyToJoin || isFetching}
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
