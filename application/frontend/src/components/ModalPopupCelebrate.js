// Modal.js
import React from "react";

import "../css/ModalPopupCelebrate.css";

const ModalPopupCelebrate = ({ closeModal, conversations }) => {

  const handleDismiss = () => {
    closeModal();
  };

  const resultText = (conversation) => {
    const result = `${
      conversation.initialLength - conversation.aiGuess
    } out of ${conversation.initialLength}`;
    return result;
  };

  return (
    <div className="modal-celeb-overlay">
      <div className="modal-celeb no-shadow">
        <button onClick={handleDismiss}>✖️</button>
        <h1>🎉 Guessing complete! 🎉</h1>
        <p>Here are your results:</p>
        <ul>
          {conversations.map((conversation, index) => (
            <li key={index}>
              {conversation.people[0].name} and {conversation.people[1].name}:{" "}
              {resultText(conversation)}
            </li>
          ))}
        </ul>
        <p>Tip for next time:</p>
        <p>TBD</p>
        <h6>
          But the experience is not over: now it's time to chat with the AI
          yourself!
        </h6>
        <p>Dismiss this to move forward.</p>
      </div>
    </div>
  );
};

export default ModalPopupCelebrate;
