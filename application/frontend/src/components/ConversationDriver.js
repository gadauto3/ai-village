import React from 'react';
import { GameState, iconsPath } from "./utils";

import "../css/ConversationDriver.css";

const ConversationDriver = ({ conversation, gameState }) => {
  if (!conversation) return <div className="conversation-driver">Please select a conversation</div>;

  const getIconPath = (name) => {
      const person = conversation.people.find(p => p.name === name);
      if (person && person.icon) {
          return `${iconsPath}/${person.icon}`;
      }
      return ''; // default if no icon found
  }

  return (
    <div className="conversation-driver">
      <div className="participants">
        <span className="to-label">To:</span>
        {conversation.people.map((person, index) => (
          <span
            key={index}
            className={`participant ${index === 0 ? "first" : ""}`}
          >
            {person.name}
            {index < conversation.people.length - 1 && ", "}
          </span>
        ))}
      </div>
      {conversation.lines.map((line, index) => (
        <div key={index} className={`line-item ${index === 0 ? "first" : ""}`}>
          <img src={getIconPath(line.name)} alt={line.name} />
          <div className="line-container">
            <span>{line.text}</span>
          </div>
        </div>
      ))}
      <div className="driver-buttons">
        {gameState > GameState.INIT && (
          <button className="next-button">Next</button>
        )}
        {gameState > GameState.INIT && (
          <button className="notice-button">I'm noticing AI generation</button>
        )}
      </div>
    </div>
  );
}

export default ConversationDriver;
