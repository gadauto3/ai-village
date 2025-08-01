import React from 'react';

import useGameState from '../hooks/useGameState';
import useModalState from '../hooks/useModalState';
import useGameStateManager from '../hooks/useGameStateManager';
import useModalHandlers from '../hooks/useModalHandlers';
import { GameProvider } from '../context/GameContext';
import GameLayout from './GameLayout';
import ModalManager from './ModalManager';

import "../css/UIController.css";

const UIController = () => {
  // Initialize state management hooks
  const gameStateHook = useGameState();
  const modalStateHook = useModalState();
  
  // Initialize game state transition management
  useGameStateManager({ gameStateHook, modalStateHook });
  
  // Initialize modal event handlers
  const modalHandlers = useModalHandlers({ gameStateHook, modalStateHook });

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
      <GameLayout 
        onJumpToInteract={modalHandlers.handleJumpToInteract}
        onJumpToEndGame={modalHandlers.handleJumpToEndGame}
      />
      
      <ModalManager 
        modalState={modalStateHook}
        onCloseCelebrateModal={modalHandlers.handleCloseCelebrateModal}
        onCloseEndGameModal={modalHandlers.handleCloseEndGameModal}
        onCloseNameModal={modalHandlers.handleCloseNameModal}
        onCloseGenericModal={modalHandlers.handleCloseGenericModal}
      />
    </GameProvider>
  );
};

export default UIController;
