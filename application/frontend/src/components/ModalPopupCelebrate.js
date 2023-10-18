// Modal.js
import React from "react";

import "../css/ModalPopupCelebrate.css";

const ModalPopupCelebrate = ({ closeModal, conversations }) => {

  const handleDismiss = () => {
    closeModal();
  };

  const resultText = (conversation) => {
    const result = `${
      Math.abs(conversation.initialLength - conversation.aiGuess)
    } away`;
    return result;
  };

  return (
    <div className="modal-celeb-overlay">
      <div className="modal-celeb no-shadow">
        <button onClick={handleDismiss}>✖️</button>
        <h1>🎉 Guessing complete! 🎉</h1>
        <p>Here are your results:</p>
        <p>
          {conversations.map((conversation, index) => (
            <span key={index}>
              <strong>{conversation.people[0].name} and {conversation.people[1].name}</strong>:{" "}
              {resultText(conversation)}
              <br />
            </span>
          ))}
        </p>
        <p>Tip for next time:</p>
        <p><strong>Coming soon!</strong></p>
        <p>&nbsp;</p>
        <h5>
          But we're not done yet, now it's time to chat with the AI yourself!
        </h5>
        <p>Dismiss this to move forward.</p>
      </div>
    </div>
  );
};

export default ModalPopupCelebrate;
