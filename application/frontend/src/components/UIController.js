import React, { useState, useEffect } from 'react';
import { GameState, isLocalHost } from './utils';

import ConversationChooser from './ConversationChooser';
import ConversationDriver from './ConversationDriver';
import Instructions from './Instructions';
import ModalPopup from "./ModalPopup";
import ModalPopupCelebrate from './ModalPopupCelebrate';
import ModalPopupEndGame from './ModalPopupEndGame';
import { TutorialState } from './Tutorial';

import "../css/UIController.css";

import conversationDataInteract from './conversationSeedsForInteract.json';

const UIController = () => {
  
  const [gameState, setGameState] = useState(GameState.INIT);
  const [conversations, setConversations] = useState([]);
  const [userName, setUserName] = useState(null);
  const [tutorialState, setTutorialState] = useState(TutorialState.WAITING);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isCelebrateModalShowing, setIsCelebrateModalShowing] = useState(false);
  const [isEndGameModalShowing, setIsEndGameModalShowing] = useState(false);
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
    if (
      selectedConversation &&
      selectedConversation.key === 0 &&
      gameState >= GameState.INTERACT &&
      tutorialState === TutorialState.MOVE_ON
    ) {
      setTutorialState(TutorialState.INTERACT_NEXT);
    }
  }, [selectedConversation]);
  
  useEffect(() => {
    if (gameState == GameState.MOVE_CONVOS) {
      const allConversationsHaveResults = conversations.every(
        (conversation) => conversation.aiGuess !== null || conversation.key === 0
      );

      if (allConversationsHaveResults) {
        setGameState(GameState.CELEBRATE);
        setIsCelebrateModalShowing(true);
      }
    } else if (gameState == GameState.ERROR) {
      const allConversationsAreDone = conversations.every(
        (conversation) => conversation.isDone || conversation.key === 0
      );
      
      console.log("allConversationsAreDone", allConversationsAreDone, conversations[0].key, conversations[1].isDone);
      if (allConversationsAreDone) {
        setIsEndGameModalShowing(true);
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

  const handleCloseEndGameModal = () => {
    setIsEndGameModalShowing(false);
    setGameState(GameState.INTERACT); // TODO???
  }

  const jumpToInteract = () => {
    setGameState(GameState.CELEBRATE);
    setConversations(conversationDataInteract);
    setSelectedConversation(conversations[1]);
    setIsCelebrateModalShowing(true);
  }

  const jumpToEndGame = () => {
    setGameState(GameState.END_GAME);
    setConversations(conversationDataInteract);
    setSelectedConversation(conversations[1]);
    setIsEndGameModalShowing(true);
  }

  const getNameFromUser = (modalConfig) => {
    setNameModalConfig(modalConfig);
    setIsNameModalShowing(true);
  };

  const handleCloseNameModal = (name) => {
    setUserName(name);
    setIsNameModalShowing(false);
  }

  const isTutorial = () => {
    return selectedConversation && selectedConversation.key === 0 && 
      tutorialState !== TutorialState.MOVE_ON && tutorialState !== TutorialState.DONE;
  };

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
            isTutorial={isTutorial}
          />
          <ConversationDriver
            conversation={selectedConversation}
            updateConversation={handleUpdateConversation}
            gameState={gameState}
            setGameState={setGameState}
            userName={userName}
            getUserName={getNameFromUser}
            isTutorial={isTutorial}
            tutorialState={tutorialState}
            setTutorialState={setTutorialState}
          />
        </div>
        <Instructions gameState={gameState} />
      </div>
      {isCelebrateModalShowing && (
        <ModalPopupCelebrate
          closeModal={handleCloseCelebrateModal}
          conversations={conversations}
          isTutorial={isTutorial}
          tutorialState={tutorialState}
        />
      )}
      {isNameModalShowing && (
        <ModalPopup
          isVisible={isNameModalShowing}
          closeModal={handleCloseNameModal}
          config={nameModalConfig}
        />
      )}
      {isEndGameModalShowing && (
        <ModalPopupEndGame
          {...{conversations, userName}}
          closeModal={handleCloseEndGameModal}
        />
      )}
      {isLocalHost() && (
        <div>
          <button onClick={jumpToInteract}>Interact</button>
          <button onClick={jumpToEndGame}>EndGame</button>
        </div>
      )}
    </div>
  );
};

export default UIController;
