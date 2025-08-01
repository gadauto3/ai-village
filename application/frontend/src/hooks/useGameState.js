import { useReducer, useCallback } from 'react';
import { GameState } from '../components/utils';
import { TutorialState } from '../components/Tutorial';

// Action types
export const GAME_ACTIONS = {
  SET_GAME_STATE: 'SET_GAME_STATE',
  SET_CONVERSATIONS: 'SET_CONVERSATIONS',
  SET_SELECTED_CONVERSATION: 'SET_SELECTED_CONVERSATION',
  SET_USER_NAME: 'SET_USER_NAME',
  SET_TUTORIAL_STATE: 'SET_TUTORIAL_STATE',
  UPDATE_CONVERSATION: 'UPDATE_CONVERSATION',
  UPDATE_ALL_API_CALLS: 'UPDATE_ALL_API_CALLS',
  JUMP_TO_INTERACT: 'JUMP_TO_INTERACT',
  JUMP_TO_END_GAME: 'JUMP_TO_END_GAME',
};

// Initial state
const initialState = {
  gameState: GameState.INIT,
  conversations: [],
  selectedConversation: null,
  userName: null,
  tutorialState: TutorialState.WAITING,
};

// Reducer function
const gameStateReducer = (state, action) => {
  switch (action.type) {
    case GAME_ACTIONS.SET_GAME_STATE:
      return {
        ...state,
        gameState: action.payload,
      };

    case GAME_ACTIONS.SET_CONVERSATIONS:
      return {
        ...state,
        conversations: action.payload,
      };

    case GAME_ACTIONS.SET_SELECTED_CONVERSATION:
      return {
        ...state,
        selectedConversation: action.payload,
      };

    case GAME_ACTIONS.SET_USER_NAME:
      return {
        ...state,
        userName: action.payload,
      };

    case GAME_ACTIONS.SET_TUTORIAL_STATE:
      return {
        ...state,
        tutorialState: action.payload,
      };

    case GAME_ACTIONS.UPDATE_CONVERSATION:
      const conversationIndex = state.conversations.findIndex(
        (conversation) => conversation.key === action.payload.key
      );
      
      if (conversationIndex !== -1) {
        const updatedConversations = [...state.conversations];
        updatedConversations[conversationIndex] = action.payload;
        
        return {
          ...state,
          conversations: updatedConversations,
          selectedConversation: action.payload,
        };
      }
      return state;

    case GAME_ACTIONS.UPDATE_ALL_API_CALLS:
      const updatedConversations = state.conversations.map((conversation) => ({
        ...conversation,
        numApiCalls: 1,
      }));
      
      return {
        ...state,
        conversations: updatedConversations,
      };

    case GAME_ACTIONS.JUMP_TO_INTERACT:
      return {
        ...state,
        gameState: GameState.CELEBRATE,
        conversations: action.payload.conversations,
        selectedConversation: action.payload.conversations[1],
      };

    case GAME_ACTIONS.JUMP_TO_END_GAME:
      return {
        ...state,
        gameState: GameState.END_GAME,
        conversations: action.payload.conversations,
        selectedConversation: action.payload.conversations[1],
      };

    default:
      return state;
  }
};

// Custom hook
const useGameState = () => {
  const [state, dispatch] = useReducer(gameStateReducer, initialState);

  // Action creators
  const setGameState = useCallback((gameState) => {
    dispatch({ type: GAME_ACTIONS.SET_GAME_STATE, payload: gameState });
  }, []);

  const setConversations = useCallback((conversations) => {
    dispatch({ type: GAME_ACTIONS.SET_CONVERSATIONS, payload: conversations });
  }, []);

  const setSelectedConversation = useCallback((conversation) => {
    dispatch({ type: GAME_ACTIONS.SET_SELECTED_CONVERSATION, payload: conversation });
  }, []);

  const setUserName = useCallback((userName) => {
    dispatch({ type: GAME_ACTIONS.SET_USER_NAME, payload: userName });
  }, []);

  const setTutorialState = useCallback((tutorialState) => {
    dispatch({ type: GAME_ACTIONS.SET_TUTORIAL_STATE, payload: tutorialState });
  }, []);

  const updateConversation = useCallback((updatedConversation) => {
    dispatch({ type: GAME_ACTIONS.UPDATE_CONVERSATION, payload: updatedConversation });
  }, []);

  const updateAllApiCalls = useCallback(() => {
    dispatch({ type: GAME_ACTIONS.UPDATE_ALL_API_CALLS });
    console.log("lines updated");
  }, []);

  const jumpToInteract = useCallback((conversations) => {
    dispatch({ 
      type: GAME_ACTIONS.JUMP_TO_INTERACT, 
      payload: { conversations } 
    });
  }, []);

  const jumpToEndGame = useCallback((conversations) => {
    dispatch({ 
      type: GAME_ACTIONS.JUMP_TO_END_GAME, 
      payload: { conversations } 
    });
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    setGameState,
    setConversations,
    setSelectedConversation,
    setUserName,
    setTutorialState,
    updateConversation,
    updateAllApiCalls,
    jumpToInteract,
    jumpToEndGame,
  };
};

export default useGameState;