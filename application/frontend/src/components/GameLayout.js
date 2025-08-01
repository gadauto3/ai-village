import React from 'react';
import { isLocalHost } from './utils';
import ConversationChooser from './ConversationChooser';
import ConversationDriver from './ConversationDriver';
import Instructions from './Instructions';
import BuildInfo from './BuildInfo';

// Component responsible for the main game layout and structure
const GameLayout = ({ onJumpToInteract, onJumpToEndGame }) => {
  return (
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

      {/* Development Tools - only shown in localhost */}
      {isLocalHost() && (
        <div>
          <button onClick={onJumpToInteract}>Interact</button>
          <button onClick={onJumpToEndGame}>EndGame</button>
        </div>
      )}

      <BuildInfo />
    </div>
  );
};

export default React.memo(GameLayout);