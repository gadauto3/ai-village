import React, { useEffect } from 'react';
import { GameState, isLocalHost } from './utils';

import ConversationChooser from './ConversationChooser';
import ConversationDriver from './ConversationDriver';
import Instructions from './Instructions';
import ModalPopup from "./ModalPopup";
import ModalPopupCelebrate from './ModalPopupCelebrate';
import ModalPopupEndGame from './ModalPopupEndGame';
import BuildInfo from './BuildInfo';
import { TutorialState } from './Tutorial';

import useGameState from '../hooks/useGameState';
import useModalState from '../hooks/useModalState';
import { GameProvider } from '../context/GameContext';

import "../css/UIController.css";

import conversationDataInteract from './conversationSeedsForInteract.json';

const UIController = () => {
  // Use custom hooks for state management
  const gameStateHook = useGameState();
  const modalStateHook = useModalState();

  useEffect(() => {
    if (gameStateHook.conversations.length > 1 && gameStateHook.gameState === GameState.INIT) {
      gameStateHook.setGameState(GameState.NEXT_CONVO);
    }
  }, [gameStateHook.conversations, gameStateHook.gameState, gameStateHook.setGameState]);

  useEffect(() => {
    if (gameStateHook.selectedConversation && gameStateHook.gameState >= GameState.INTERACT) {
      // Handle tutorial
      if (gameStateHook.selectedConversation.key === 0 && gameStateHook.tutorialState === TutorialState.MOVE_ON) {
        gameStateHook.setTutorialState(TutorialState.INTERACT_NEXT);
      } else if (gameStateHook.gameState === GameState.ERROR) {
        // Handle post-error state
        gameStateHook.setGameState(GameState.INTERACT);
      }
    }
  }, [gameStateHook.selectedConversation, gameStateHook.gameState, gameStateHook.tutorialState, gameStateHook.setTutorialState, gameStateHook.setGameState]);
  useEffect(() => {
    const allConversationsHaveResults = gameStateHook.conversations.every(
      (conversation) => conversation.aiGuess !== null || conversation.key === 0
    );
    
    const allConversationsAreDone = gameStateHook.conversations.every(
      (conversation) => conversation.isDone || conversation.key === 0
    );

    if (gameStateHook.gameState === GameState.MOVE_CONVOS) {
      if (allConversationsHaveResults) {
        gameStateHook.setGameState(GameState.CELEBRATE);
        modalStateHook.showCelebrateModal();
        gameStateHook.updateAllApiCalls();
      }
    } else if (gameStateHook.gameState === GameState.ERROR) {
      if (allConversationsAreDone) {
        setTimeout(() => {
          modalStateHook.showEndGameModal();
          gameStateHook.setGameState(GameState.END_GAME);
        }, 700);
      }
    }
  }, [gameStateHook.gameState, gameStateHook.conversations, gameStateHook.setGameState, gameStateHook.updateAllApiCalls, modalStateHook.showCelebrateModal, modalStateHook.showEndGameModal]);
  // Event handlers using the new hooks
  const handleCloseCelebrateModal = () => {
    modalStateHook.hideCelebrateModal();
    gameStateHook.setGameState(GameState.INTERACT);
  };

  const handleCloseEndGameModal = () => {
    modalStateHook.hideEndGameModal();
    gameStateHook.setGameState(GameState.INTERACT);
  };

  const handleCloseNameModal = (name) => {
    gameStateHook.setUserName(name);
    modalStateHook.hideNameModal();
  };

  const handleJumpToInteract = () => {
    gameStateHook.jumpToInteract(conversationDataInteract);
    modalStateHook.showCelebrateModal();
  };

  const handleJumpToEndGame = () => {
    gameStateHook.jumpToEndGame(conversationDataInteract);
    modalStateHook.showEndGameModal();
  };

  return (
    <GameProvider
      // Game state props
      gameState={gameStateHook.gameState}
      conversations={gameStateHook.conversations}
      selectedConversation={gameStateHook.selectedConversation}
      userName={gameStateHook.userName}
      tutorialState={gameStateHook.tutorialState}
      // Game state actions
      setGameState={gameStateHook.setGameState}
      setConversations={gameStateHook.setConversations}
      setSelectedConversation={gameStateHook.setSelectedConversation}
      setUserName={gameStateHook.setUserName}
      setTutorialState={gameStateHook.setTutorialState}
      updateConversation={gameStateHook.updateConversation}
      updateAllApiCalls={gameStateHook.updateAllApiCalls}
      jumpToInteract={gameStateHook.jumpToInteract}
      jumpToEndGame={gameStateHook.jumpToEndGame}
      // Modal actions
      showCelebrateModal={modalStateHook.showCelebrateModal}
      hideCelebrateModal={modalStateHook.hideCelebrateModal}
      showEndGameModal={modalStateHook.showEndGameModal}
      hideEndGameModal={modalStateHook.hideEndGameModal}
      showNameModal={modalStateHook.showNameModal}
      hideNameModal={modalStateHook.hideNameModal}
      showGenericModal={modalStateHook.showGenericModal}
      hideGenericModal={modalStateHook.hideGenericModal}
    >
      <div className="outer-div">
        <h1 className="text-center title-quicksand">
          <span className="smaller-font">A</span>iMessage
        </h1>
        <div className="ui-controller">
          <div className="top-section">
            <ConversationChooser />
            <ConversationDriver />
          </div>
          <Instructions />
        </div>
        {modalStateHook.isCelebrateModalShowing && (
          <ModalPopupCelebrate
            closeModal={handleCloseCelebrateModal}
          />
        )}
        {modalStateHook.isNameModalShowing && (
          <ModalPopup
            isVisible={modalStateHook.isNameModalShowing}
            closeModal={handleCloseNameModal}
            config={modalStateHook.modalConfig}
          />
        )}
        {modalStateHook.isGenericModalShowing && (
          <ModalPopup
            isVisible={modalStateHook.isGenericModalShowing}
            closeModal={modalStateHook.hideGenericModal}
            config={modalStateHook.modalConfig}
          />
        )}
        {modalStateHook.isEndGameModalShowing && (
          <ModalPopupEndGame
            closeModal={handleCloseEndGameModal}
          />
        )}
        {isLocalHost() && (
          <div>
            <button onClick={handleJumpToInteract}>Interact</button>
            <button onClick={handleJumpToEndGame}>EndGame</button>
          </div>
        )}
        <BuildInfo />
      </div>
    </GameProvider>
  );
};

export default UIController;
