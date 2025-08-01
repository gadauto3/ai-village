import { useEffect } from 'react';
import { GameState } from '../components/utils';
import { TutorialState } from '../components/Tutorial';

// Custom hook to manage game state transitions and side effects
const useGameStateManager = ({ gameStateHook, modalStateHook }) => {
  // Effect 1: Handle initial conversation setup
  useEffect(() => {
    if (gameStateHook.conversations.length > 1 && gameStateHook.gameState === GameState.INIT) {
      gameStateHook.setGameState(GameState.NEXT_CONVO);
    }
  }, [gameStateHook.conversations, gameStateHook.gameState, gameStateHook.setGameState]);

  // Effect 2: Handle tutorial transitions and error recovery
  useEffect(() => {
    if (gameStateHook.selectedConversation && gameStateHook.gameState >= GameState.INTERACT) {
      // Handle tutorial progression
      if (gameStateHook.selectedConversation.key === 0 && gameStateHook.tutorialState === TutorialState.MOVE_ON) {
        gameStateHook.setTutorialState(TutorialState.INTERACT_NEXT);
      } else if (gameStateHook.gameState === GameState.ERROR) {
        // Handle post-error state recovery
        gameStateHook.setGameState(GameState.INTERACT);
      }
    }
  }, [
    gameStateHook.selectedConversation, 
    gameStateHook.gameState, 
    gameStateHook.tutorialState, 
    gameStateHook.setTutorialState, 
    gameStateHook.setGameState
  ]);

  // Effect 3: Handle game completion and end game transitions
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
  }, [
    gameStateHook.gameState, 
    gameStateHook.conversations, 
    gameStateHook.setGameState, 
    gameStateHook.updateAllApiCalls, 
    modalStateHook.showCelebrateModal, 
    modalStateHook.showEndGameModal
  ]);

  // Return any helper functions that might be needed
  return {
    // No additional functions needed for now
  };
};

export default useGameStateManager;