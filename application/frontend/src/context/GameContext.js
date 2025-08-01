import React, { createContext, useContext, useMemo } from 'react';
import { TutorialState } from '../components/Tutorial';

// Create the context
const GameContext = createContext();

// Custom hook to use the GameContext
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

// GameProvider component
export const GameProvider = ({ 
  children, 
  gameState, 
  conversations, 
  selectedConversation, 
  userName, 
  tutorialState,
  setGameState,
  setConversations,
  setSelectedConversation,
  setUserName,
  setTutorialState,
  updateConversation,
  updateAllApiCalls,
  jumpToInteract,
  jumpToEndGame,
  // Modal actions
  showCelebrateModal,
  hideCelebrateModal,
  showEndGameModal,
  hideEndGameModal,
  showNameModal,
  hideNameModal,
  showGenericModal,
  hideGenericModal,
}) => {
  // Memoized computed values
  const isTutorial = useMemo(() => {
    return (
      selectedConversation &&
      selectedConversation.key === 0 &&
      tutorialState !== TutorialState.MOVE_ON &&
      tutorialState !== TutorialState.DONE
    );
  }, [selectedConversation, tutorialState]);

  const allConversationsHaveResults = useMemo(() => {
    return conversations.every(
      (conversation) => conversation.aiGuess !== null || conversation.key === 0
    );
  }, [conversations]);

  const allConversationsAreDone = useMemo(() => {
    return conversations.every(
      (conversation) => conversation.isDone || conversation.key === 0
    );
  }, [conversations]);

  // Context value
  const contextValue = useMemo(() => ({
    // Game state
    gameState,
    conversations,
    selectedConversation,
    userName,
    tutorialState,
    
    // Computed values
    isTutorial,
    allConversationsHaveResults,
    allConversationsAreDone,
    
    // Game actions
    setGameState,
    setConversations,
    setSelectedConversation,
    setUserName,
    setTutorialState,
    updateConversation,
    updateAllApiCalls,
    jumpToInteract,
    jumpToEndGame,
    
    // Modal actions
    showCelebrateModal,
    hideCelebrateModal,
    showEndGameModal,
    hideEndGameModal,
    showNameModal,
    hideNameModal,
    showGenericModal,
    hideGenericModal,
  }), [
    gameState,
    conversations,
    selectedConversation,
    userName,
    tutorialState,
    isTutorial,
    allConversationsHaveResults,
    allConversationsAreDone,
    setGameState,
    setConversations,
    setSelectedConversation,
    setUserName,
    setTutorialState,
    updateConversation,
    updateAllApiCalls,
    jumpToInteract,
    jumpToEndGame,
    showCelebrateModal,
    hideCelebrateModal,
    showEndGameModal,
    hideEndGameModal,
    showNameModal,
    hideNameModal,
    showGenericModal,
    hideGenericModal,
  ]);

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};