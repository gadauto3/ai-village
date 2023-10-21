// Modal.js
import React from "react";

import "../css/ModalPopupCelebrate.css";
import ScoreHandler from "./ScoreHandler";
import TargetVisualizer from "./TargetVisualizer";

const ModalPopupCelebrate = ({ closeModal, conversations }) => {
  const scoreHandler = ScoreHandler();

  const handleDismiss = () => {
    closeModal();
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

  const mapDataForTip = () => {
    const mappedConvos = conversations.map((convo) => ({
      people: convo.people[0].name + " and " + convo.people[1].name,
      guessIndex: convo.aiGuess,
      answerIndex: convo.initialLength,
    }));
    return mappedConvos;
  };

  const getAccuracy = () => {
    // Get the sum of all answerIndexes
    const totalPossible = conversations.reduce(
      (sum, convo) => sum + convo.initialLength,
      0
    );

    // Get the sum of the absolute differences between guessIndexes and answerIndexes
    const totalDelta = conversations.reduce(
      (sum, convo) => sum + Math.abs(convo.aiGuess - convo.initialLength),
      0
    );

    // Calculate accuracy
    const accuracy = (totalPossible - totalDelta) / totalPossible;

    return accuracy;
  };

  return (
    <div className="modal-celeb-overlay">
      <div className="modal-celeb no-shadow">
        <button className="dismiss-button" onClick={handleDismiss}>✖️</button>
        <h1>🎉 Guessing complete! 🎉</h1>
        <p>Here are your results:</p>
        <p>
          {conversations.map((conversation, index) => (
            <span key={index}>
              <em>{conversation.people[0].name} and {conversation.people[1].name}</em>:{" "}
              {resultText(conversation)}
              <br />
            </span>
          ))}
        </p>
        <TargetVisualizer numberOfRings={7} fillAmount={getAccuracy()}/><br />
        <p><strong>Tip for next time:</strong></p>
        <p>{scoreHandler.tipForScores(mapDataForTip())}</p>
        <p>&nbsp;</p>
        <h5>
          But we're not done yet, now it's time to chat with the AI yourself!
        </h5>
        <p><button className="done-button" onClick={handleDismiss}>Ready</button></p>
      </div>
    </div>
  );
};

export default ModalPopupCelebrate;
