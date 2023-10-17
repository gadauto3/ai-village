import React from 'react';

const ScoreHandler = () => {

  const calculateScoreMessage = (guessIndex, targetIndex) => {
    // Calculate the difference between the guessIndex and targetIndex
    const delta = Math.abs(guessIndex - targetIndex);

    // Generate a message based on the difference
    if (delta === 0) {
      const randomIndex = Math.floor(Math.random() * perfectOptions.length);
      return perfectOptions[randomIndex];
    } else if (delta <= 2) {
      return `Great job! You were very close, just ${delta} off.`;
    } else if (delta <= 7) {
      return `Not bad! You're in the ballpark. You were ${delta} away.`;
    } else {
      return `Oops! You missed by quite a bit. The answer is ${delta} away.`;
    }
  };

  const perfectOptions = [
    "Precisely right!",
    "On the money!",
    "You did awesome! This is it.",
    "This is the right answer!",
    "How did you know it was this one?",
  ];

  // Return the method for external use. 
  // You can also return JSX here if this component has any UI elements.
  return { calculateScoreMessage };
};

export default ScoreHandler;
