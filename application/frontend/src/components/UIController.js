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
  const [isGenericModalShowing, setIsGenericModalShowing] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    textToDisplay: "Default message",
    buttonText: "Ok",
    onClose: () => {}
  });

  useEffect(() => {
    if (conversations.length > 1 && gameState === GameState.INIT) {
      setGameState(GameState.NEXT_CONVO);
    }
  }, [conversations]);

  useEffect(() => {
    if (selectedConversation && gameState >= GameState.INTERACT) {
      // Handle tutorial
      if (selectedConversation.key === 0 && tutorialState === TutorialState.MOVE_ON) {
        setTutorialState(TutorialState.INTERACT_NEXT);
      } else if (gameState === GameState.ERROR) {
        // Handle post-error state
        setGameState(GameState.INTERACT);
      }
    }
  }, [selectedConversation]);
  
  useEffect(() => {
    if (gameState === GameState.MOVE_CONVOS) {
      const allConversationsHaveResults = conversations.every(
        (conversation) => conversation.aiGuess !== null || conversation.key === 0
      );

      if (allConversationsHaveResults) {
        setGameState(GameState.CELEBRATE);
        setIsCelebrateModalShowing(true);
        updateNumApiCallsForAll();
      }
    } else if (gameState === GameState.ERROR) {
      const allConversationsAreDone = conversations.every(
        (conversation) => conversation.isDone || conversation.key === 0
      );
      
      if (allConversationsAreDone) {
        setTimeout(() => {
          setIsEndGameModalShowing(true);
          setGameState(GameState.END_GAME);
        }, 700);
      }
    }
  }, [gameState]);
  
  const handleUpdateConversation = (updatedConversation) => {
    const conversationIndex = conversations.findIndex(
      (conversation) => conversation.key === updatedConversation.key
    );
  
    if (conversationIndex !== -1) {
      const updatedConversations = [...conversations];
      updatedConversations[conversationIndex] = updatedConversation;
  
      setConversations(updatedConversations);
      setSelectedConversation(updatedConversation);
    }
  };  

  const handleCloseCelebrateModal = () => {
    setIsCelebrateModalShowing(false);
    setGameState(GameState.INTERACT);
  };

  const handleCloseEndGameModal = () => {
    setIsEndGameModalShowing(false);
    setGameState(GameState.INTERACT);
  };

  const jumpToInteract = () => {
    setGameState(GameState.CELEBRATE);
    setConversations(conversationDataInteract);
    setSelectedConversation(conversations[1]);
    setIsCelebrateModalShowing(true);
  };

  const jumpToEndGame = () => {
    setGameState(GameState.END_GAME);
    setConversations(conversationDataInteract);
    setSelectedConversation(conversations[1]);
    setIsEndGameModalShowing(true);
  };

  const getNameFromUser = (modalConfig) => {
    setModalConfig(modalConfig);
    setIsNameModalShowing(true);
  };

  const handleCloseNameModal = (name) => {
    setUserName(name);
    setIsNameModalShowing(false);
  };

  const displayGenericModal = (modalConfig) => {
    setModalConfig(modalConfig);
    setIsGenericModalShowing(true);
  };

  const handleCloseGenericModal = () => {
    setIsGenericModalShowing(false);
  };

  const isTutorial = () => {
    return (
      selectedConversation &&
      selectedConversation.key === 0 &&
      tutorialState !== TutorialState.MOVE_ON &&
      tutorialState !== TutorialState.DONE
    );
  };

  const updateNumApiCallsForAll = () => {
    const updatedConversations = conversations.map((conversation) => ({
      ...conversation,
      numApiCalls: 1,
    }));
    console.log("lines updated");
    setConversations(updatedConversations);
  };

  return (
    <div className="outer-div">
      <h1 className="text-center title-quicksand">
        <span className="smaller-font">A</span>iMessage
      </h1>
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
            displayModal={displayGenericModal}
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
          config={modalConfig}
        />
      )}
      {isGenericModalShowing && (
        <ModalPopup
          isVisible={isGenericModalShowing}
          closeModal={handleCloseGenericModal}
          config={modalConfig}
        />
      )}
      {isEndGameModalShowing && (
        <ModalPopupEndGame
          {...{ conversations, userName }}
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
