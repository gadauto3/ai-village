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
      setGameState(GameState.NOTICE_AI);
    }
  }, [conversations]);
  
  return (
    <div>
    <h1 className="text-center title-noto-sans">
      MessAIges
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
          gameState={gameState}
        />
      </div>
      <Instructions gameState={gameState} />
    </div>
    </div>
  );
};

export default UIController;
