import React, { useState, useRef, useEffect } from 'react';
import { GameState, iconsPath } from "./utils";

import "../css/ConversationDriver.css";

const ConversationDriver = ({ conversation, gameState }) => {
  const [conversationIndex, setConversationIndex] = useState(0);
  const [showCheckboxes, setShowCheckboxes] = useState(false);  // To show/hide checkboxes
  const [checkedIndex, setCheckedIndex] = useState(null);  // Index of the checked checkbox
  const linesContainerRef = useRef(null);

  const NOTICE_INDEX = 1;

  useEffect(() => {
      if (linesContainerRef.current) {
          linesContainerRef.current.scrollTop = linesContainerRef.current.scrollHeight;
      }
  }, [conversationIndex]);

  if (!conversation)
    return (
      <div className="conversation-driver"></div>
    );

  const getIconPath = (name) => {
      const person = conversation.people.find(p => p.name === name);
      if (person && person.icon) {
          return `${iconsPath}/${person.icon}`;
      }
      return '';
  }

  const handleNextClick = () => {
    setConversationIndex(prevIndex => prevIndex + 1);
  };

  const handleCheckboxChange = (index) => {
    setCheckedIndex(index);
  };

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

      <div className="lines-container" ref={linesContainerRef}>
        {conversation.lines.slice(0, conversationIndex + 1).map((line, index) => (
            <div
              key={index}
              className={`line-item ${index === 0 ? "first" : ""}`}
            >
              <img src={getIconPath(line.name)} alt={line.name} />
              <div className="line-container">
                <span>{line.text}</span>
              </div>
                {showCheckboxes && 
                  <input 
                    type="checkbox" 
                    className="line-checkbox" 
                    checked={checkedIndex === index}
                    onChange={() => handleCheckboxChange(index)}
                  />
                }
            </div>
          ))}
      </div>

      <div className="driver-buttons">
        {gameState > GameState.INIT && (
          <button className="next-button" onClick={handleNextClick} disabled={showCheckboxes}>
            Next
          </button>
        )}
        {gameState > GameState.INIT && conversationIndex > NOTICE_INDEX && (
          <button className="notice-button" onClick={() => setShowCheckboxes(!showCheckboxes)}>
            I'm noticing AI generation
          </button>
        )}
      </div>
    </div>
  );
}

export default ConversationDriver;
