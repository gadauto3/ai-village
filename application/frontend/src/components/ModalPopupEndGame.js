// Modal.js
import React from "react";

import "../css/ModalPopupEndGame.css";
import ScoreHandler from "./ScoreHandler";

const ModalPopupEndGame = ({ closeModal, conversations, userName }) => {
  const scoreHandler = ScoreHandler();

  const handleDismiss = () => {
    closeModal();
  };

  const handleRestart = () => {
    window.location.reload();
  };

  const resultText = (conversation) => {
    const resultValue = Math.abs(conversation.initialLength - conversation.aiGuess);
    let result = `${resultValue} away`;
    if (resultValue === 0) {
      const randIndex = Math.floor(Math.random() * scoreHandler.perfectOptions.length);
      result = scoreHandler.perfectOptions[randIndex];
    }
    return result;
  };

  const convos = () => {
    // Ignore the first element because it's the tutorial level
    return conversations.slice(1);
  };

  return (
    <div className="modal-end-game-overlay">
      <div className="modal-end-game no-shadow">
        <button className="dismiss-button" onClick={handleDismiss}>
          ✖️
        </button>
        <h1>🏆 Game Over 🏆</h1>
        <div className="results-container">
          <table className="conversations-table">
            <thead>
              <tr>
                <th>Participants</th>
                <th>Total lines</th>
                <th>AI calls</th>
                <th>Wait time</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {convos().map((conversation, index) => {
                const aiCalls = conversation.lines.filter(
                  (line) => line.message
                ).length;
                const joined = conversation.lines.filter(
                  (line) => line.name === userName
                ).length;
                return (
                  <tr key={index}>
                    <td>
                      <em>
                        {conversation.people[0].name} &{" "}
                        {conversation.people[1].name}
                      </em>
                    </td>
                    <td>{conversation.lines.length}</td>
                    <td>{aiCalls}</td>
                    <td>{Math.round(conversation.apiCallTime)}s</td>
                    <td>{joined}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <hr />
        <p>
          <strong>Tip for next time:</strong>
        </p>
        <p>
          {" "}
          if you get the same character threads next time, you can better guess
          the AI transition point.
        </p>
        <p>&nbsp;</p>
        <h5>Would you like to try again or review the conversations?</h5>
        <p>
          <button className="done-button" onClick={handleRestart}>
            Try again
          </button>
          <button className="done-button" onClick={handleDismiss}>
            Review convos
          </button>
        </p>
      </div>
    </div>
  );
};

export default ModalPopupEndGame;
