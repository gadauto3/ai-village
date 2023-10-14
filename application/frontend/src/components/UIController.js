import React, { useState, useEffect } from 'react';
import { GameState } from './utils';

import ConversationChooser from './ConversationChooser';
import ConversationDriver from './ConversationDriver';
import Instructions from './Instructions';

import "../css/UIController.css";
import conversationData from './conversationSeeds.json';

const UIController = () => {
  
  const [gameState, setGameState] = useState(GameState.INIT);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    // This is where you would normally fetch the data from an API or other source.
    // For now, we'll use the provided data.
    setConversations(conversationData);

    // Set the first conversation as the default selected one
    if (conversationData.length > 0) {
      setSelectedConversation(conversationData[0]);
    }
  }, []);

  return (
    <div>
    <h1 className="text-center title-noto-sans">
      iMessAIge
    </h1>
    <div className="ui-controller">
      <div className="top-section">
        <ConversationChooser
          conversations={conversations}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
        />
        <ConversationDriver
          conversation={selectedConversation}
          gameState={gameState}
        />
      </div>
      <Instructions gameState={gameState} />
    </div>
    </div>
  );
};

export default UIController;
