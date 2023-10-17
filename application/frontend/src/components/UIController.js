import React, { useState, useEffect } from 'react';
import { GameState } from './utils';

import ConversationChooser from './ConversationChooser';
import ConversationDriver from './ConversationDriver';
import Instructions from './Instructions';
import ModalPopup from "./ModalPopup";
import ModalPopupCelebrate from './ModalPopupCelebrate';

import "../css/UIController.css";

import conversationDataInteract from './conversationSeedsForInteract.json';

const UIController = () => {
  
  const [gameState, setGameState] = useState(GameState.INIT);
  const [conversations, setConversations] = useState([]);
  const [userName, setUserName] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isCelebrateModalShowing, setIsCelebrateModalShowing] = useState(false);
  const [isNameModalShowing, setIsNameModalShowing] = useState(false);
  const [nameModalConfig, setNameModalConfig] = useState({
    textToDisplay: "Default message",
    buttonText: "Ok",
    onClose: () => {}
  });

  useEffect(() => {
    if (conversations.length > 1 && gameState == GameState.INIT) {
      setGameState(GameState.NEXT_CONVO);
    }
  }, [conversations]);
  
  useEffect(() => {
    if (gameState == GameState.MOVE_CONVOS) {
      const allConversationsHaveResults = conversations.every(
        (conversation) => conversation.aiGuess !== null
      );

      if (allConversationsHaveResults) {
        setGameState(GameState.CELEBRATE);
        setIsCelebrateModalShowing(true);
      }
    }
  }, [gameState]);
  
  const handleUpdateConversation = (updatedConversation) => {
    // Find the index of the conversation with the same key as updatedConversation
    const index = conversations.findIndex(convo => convo.key === updatedConversation.key);
  
    if (index !== -1) {
      // Create a copy of the conversations array
      const newConversations = [...conversations];
  
      // Replace the old conversation with the updated one
      newConversations[index] = updatedConversation;
  
      // Update the state
      setConversations(newConversations);
      setSelectedConversation(updatedConversation);
    }
  };  

  const handleCloseCelebrateModal = () => {
    setIsCelebrateModalShowing(false);
    setGameState(GameState.INTERACT);
  }

  const jumpToInteract = () => {
    setGameState(GameState.CELEBRATE);
    setConversations(conversationDataInteract);
    setSelectedConversation(conversations[1]);
    setIsCelebrateModalShowing(true);
  }

  const getNameFromUser = (modalConfig) => {
    console.log("pop up modal to get username");
    setNameModalConfig(modalConfig);
    setIsNameModalShowing(true);
  };

  const handleCloseNameModal = (name) => {
    setUserName(name);
    setIsNameModalShowing(false);
  }

  return (
    <div className="outer-div">
      <h1 className="text-center title-noto-sans">WhatsAIpp or MessAIges</h1>
      <div className="ui-controller">
        <div className="top-section">
          <ConversationChooser
            conversations={conversations}
            setConversations={setConversations}
            gameState={gameState}
            selectedConversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
          />
          <ConversationDriver
            conversation={selectedConversation}
            updateConversation={handleUpdateConversation}
            gameState={gameState}
            setGameState={setGameState}
            userName={userName}
            getUserName={getNameFromUser}
          />
        </div>
        <Instructions gameState={gameState} />
      </div>
      {isCelebrateModalShowing && (
        <ModalPopupCelebrate
          closeModal={handleCloseCelebrateModal}
          conversations={conversations}
        />
      )}
      {isNameModalShowing && (
        <ModalPopup
          isVisible={isNameModalShowing}
          closeModal={handleCloseNameModal}
          config={nameModalConfig}
        />
      )}
      <div>
        <button onClick={jumpToInteract}>Interact</button>
      </div>
    </div>
  );
};

export default UIController;
