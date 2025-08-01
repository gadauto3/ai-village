import { useCallback } from 'react';
import { GameState } from '../components/utils';
import conversationDataInteract from '../components/conversationSeedsForInteract.json';

// Custom hook for modal event handlers
const useModalHandlers = ({ gameStateHook, modalStateHook }) => {
  const handleCloseCelebrateModal = useCallback(() => {
    modalStateHook.hideCelebrateModal();
    gameStateHook.setGameState(GameState.INTERACT);
  }, [modalStateHook.hideCelebrateModal, gameStateHook.setGameState]);

  const handleCloseEndGameModal = useCallback(() => {
    modalStateHook.hideEndGameModal();
    gameStateHook.setGameState(GameState.INTERACT);
  }, [modalStateHook.hideEndGameModal, gameStateHook.setGameState]);

  const handleCloseNameModal = useCallback((name) => {
    gameStateHook.setUserName(name);
    modalStateHook.hideNameModal();
  }, [gameStateHook.setUserName, modalStateHook.hideNameModal]);

  const handleCloseGenericModal = useCallback(() => {
    modalStateHook.hideGenericModal();
  }, [modalStateHook.hideGenericModal]);

  // Development helper functions
  const handleJumpToInteract = useCallback(() => {
    gameStateHook.jumpToInteract(conversationDataInteract);
    modalStateHook.showCelebrateModal();
  }, [gameStateHook.jumpToInteract, modalStateHook.showCelebrateModal]);

  const handleJumpToEndGame = useCallback(() => {
    gameStateHook.jumpToEndGame(conversationDataInteract);
    modalStateHook.showEndGameModal();
  }, [gameStateHook.jumpToEndGame, modalStateHook.showEndGameModal]);

  return {
    handleCloseCelebrateModal,
    handleCloseEndGameModal,
    handleCloseNameModal,
    handleCloseGenericModal,
    handleJumpToInteract,
    handleJumpToEndGame,
  };
};

export default useModalHandlers;