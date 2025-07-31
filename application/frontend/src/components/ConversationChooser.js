import React, { useState, useEffect } from "react";
import { GameState, MAX_CONVOS, iconsPath, isLocalHost } from "./utils";
import { getConversations } from "./APIService";
import AnimatedCircles from "./AnimatedCircles";

import conversationData from "./conversationSeeds.json";
import tutorialData from "../../../backend/nodejs/tutorialSeed.json";
import searchBarImg from "../assets/images/searchBar.png";

import "../css/ConversationChooser.css";
import "../css/utils.css";
import { TutorialState } from "./Tutorial";

const ConversationChooser = ({
  conversations,
  setConversations,
  gameState,
  selectedConversation,
  setSelectedConversation,
  isTutorial,
  tutorialState,
}) => {
  const [areConversationsSet, setAreConversationsSet] = useState(false);
  const [isConvosMax, setIsConvosMax] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preInitConvos, setPreInitConvos] = useState(["Conversation 1", "Conversation 2"]);

  const defaultHeadIcon = "icons8-head-profile-50.png";
  const numPreviewChars = 25;

  // TODO: For dev, remove later.
  useEffect(() => {
    if (gameState === GameState.CELEBRATE && conversations.length > 1) {
      setAreConversationsSet(true);
    }
  }, [conversations]);

  const addConversation = () => {
    const convos = [...preInitConvos];

    if (convos.length == MAX_CONVOS) {
      setIsConvosMax(true);
    } else {
      convos.push("Conversation " + (convos.length + 1));
      setPreInitConvos(convos);
    }
  };

  const clickStart = () => {
    setIsLoading(true);
    getConversations(preInitConvos.length, handleSuccess, handleError);
  };

  const handleSuccess = (conversations) => {
    setIsLoading(false);
    setAreConversationsSet(true);
    setConversations(conversations);
  };

  const handleError = (err) => {
    console.log("retrieveConversations api error\n", err);

    if (isLocalHost()) {
      handleSuccess(makeMockLines(preInitConvos.length));
    } else {
      alert(
        "Sorry, failed to retrieve conversations due to an error, try refreshing.\n" +
          err
      );
    }
  };

  const makeMockLines = () => {
    const convos = [ tutorialData ];
    convos.push(...conversationData.slice(0, preInitConvos.length - 1));
    return convos;
  };

  const safeSetConversation = (convo) => {
    if (!isDivDisabled()) {
      setSelectedConversation(convo);
    }
  };

  const isDivDisabled = (convo) => {
    return (
      gameState === GameState.SELECT_AI ||
      gameState === GameState.JOIN_CONVO ||
      isTutorial() ||
      (convo && convo.key === 0 && tutorialState === TutorialState.DONE)
    );
  };

  return (
    <div className="conversation-chooser">
      <img className="search-bar" src={searchBarImg} alt="Search Bar" />
      {areConversationsSet &&
        conversations.map((conversation, index) => (
          <div
            key={index}
            className={`conversation-item ${
              conversation === selectedConversation ? "selected" : ""
            } ${isDivDisabled(conversation) ? "div-disabled" : ""}`}
            onClick={() => safeSetConversation(conversation)}
          >
            <div className="image-container">
              <img
                src={`${iconsPath}${conversation.people[1].icon}`}
                alt="Bottom Image"
                className="bottom-image"
              />
              <img
                src={`${iconsPath}${conversation.people[0].icon}`}
                alt="Top Image"
                className="top-image"
              />
            </div>

            <div className="text-container">
              <span
                className={`conversation-item-names ${
                  conversation === selectedConversation ? "selected" : ""
                }`}
              >
                {conversation.people.map((person) => person.name).join(", ")}
              </span>
              <span
                className={`conversation-item-preview ${
                  conversation === selectedConversation ? "selected" : ""
                }`}
              >
                {conversation.people[0].currentLine.length > numPreviewChars
                  ? conversation.people[0].currentLine
                      .slice(0, numPreviewChars)
                      .trim() + "..."
                  : conversation.people[0].currentLine}
              </span>
            </div>
          </div>
        ))}

      {!areConversationsSet &&
        preInitConvos.map((preConvo, index) => (
          <div key={index} className="conversation-item">
            <div className="image-container">
              <img
                src={`${iconsPath}${defaultHeadIcon}`}
                alt="Bottom Image"
                className="bottom-image"
              />
              <img
                src={`${iconsPath}${defaultHeadIcon}`}
                alt="Top Image"
                className="top-image"
              />
            </div>
            <div className="text-container spacing">
              <span className="conversation-item-names">{preConvo}</span>
            </div>
          </div>
        ))}

      {isLoading && (
        <div className="animated-circles-container">
          {isLoading && <AnimatedCircles />}
        </div>
      )}

      {gameState === GameState.INIT && (
        <button
          className="add-conversation-button"
          onClick={addConversation}
          disabled={isConvosMax}
        >
          Add conversation
        </button>
      )}

      {gameState === GameState.INIT && (
        <button
          className="start-button"
          onClick={clickStart}
          disabled={preInitConvos.length <= 2}
        >
          Start
        </button>
      )}
    </div>
  );
};

export default React.memo(ConversationChooser);
