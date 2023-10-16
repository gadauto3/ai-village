import React, { useState, useEffect } from 'react';
import { GameState } from './utils';

import ConversationChooser from './ConversationChooser';
import ConversationDriver from './ConversationDriver';
import Instructions from './Instructions';

import "../css/UIController.css";

const UIController = () => {
  
  const [gameState, setGameState] = useState(GameState.INIT);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    if (conversations.length > 1 && gameState == GameState.INIT) {
      setGameState(GameState.NEXT_CONVO);
    }
  }, [conversations]);
  
  useEffect(() => {
    if (gameState == GameState.MOVE_CONVOS) {
      const allConversationsHaveResults = conversations.every(
        (conversation) => conversation.aiResult !== null
      );

      if (allConversationsHaveResults) {
        setGameState(GameState.INTERACT);
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
    }
  };  

  return (
    <div>
    <h1 className="text-center title-noto-sans">
      WhatsAIpp or MessAIges
    </h1>
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
        />
      </div>
      <Instructions gameState={gameState} />
    </div>
    </div>
  );
};

export default UIController;
