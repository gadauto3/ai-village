import React, { useState, useRef, useEffect } from "react";

import AnimatedCircles from "./AnimatedCircles";
import { AI_CONVO_INDEX, TutorialState } from "./Tutorial";
import {
  aiStartsHereMsg,
  userNameError,
  validateMessage,
} from "./longStrings";

const DriverInteractWithAI = ({
  
}) => {

  useEffect(() => {
    if (linesContainerRef.current) {
      linesContainerRef.current.scrollTop =
        linesContainerRef.current.scrollHeight;
    }
  }, [conversation, isFetching]);

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
      return;
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
      convoLines[msgIndex].message = aiStartsHereMsg + `, added ${moreLines.length} lines.`;
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
    const errorMessage = validateMessage(userInput, userName);

    // Check for and handle errors
    if (errorMessage) {
      setUserInputError(errorMessage);

      if (errorMessage === userNameError) {
        const peeps = conversation.people;
        getUserName({
          textToDisplay: `Please provide your name to ${peeps[0].name} and ${peeps[1].name}. Note: your name will be used only for this round of the game.`,
          buttonText: "Done",
          entryLengthMin: 3,
          entryLengthMax: 20,
          onClose: () => {console.log("handleMessageSubmit");},
        });
      }
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
  
  // INTERACT Stage functions
  const handleTutorialAPISuccess = (moreLines) => {
    // Split the lines before and after the AI index
    const convoLines = conversationRef.current.lines;
    const tutorialEndLines = convoLines.splice(AI_CONVO_INDEX + 1);
    const tutorialSoFarLines = convoLines.splice(0, AI_CONVO_INDEX + 1);
    const aiAdded = moreLines.length;
    const aiIndex = tutorialSoFarLines.length;

    moreLines.push(...tutorialEndLines);
    tutorialSoFarLines.push(...moreLines);
    tutorialSoFarLines[aiIndex].message =
      aiStartsHereMsg + `, added ${aiAdded} lines.`;
    const newConvo = deepCopy(conversationRef.current);
    newConvo.lines = tutorialSoFarLines;
    newConvo.currentLineIndex++; // Increment twice with the function below
    conversationRef.current = newConvo;
    incrementIndex(newConvo);

    setIsFetching(false);
  };

  const handleTutorialAPIFailure = (err) => {
    if (isLocalHost()) {
      const moreLines = makeMockLines(conversation.lines, "tutorial");
      handleTutorialAPISuccess(moreLines);
    }
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

      {gameState >= GameState.INTERACT && (
        <div className="driver-buttons">
          <button
            className="next-button"
            onClick={handleNextInteractClick}
            disabled={isReadyToJoin || isFetching || (conversation.key === 0 && tutorialState === TutorialState.DONE)}
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
)};

export default DriverInteractWithAI;