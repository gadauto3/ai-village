import React from "react";

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

  const tipForScores = (convoData) => {
    console.log("conversationData", convoData);

    if (convoData.some((item) => item.guessIndex < item.answerIndex - 1)) {
      return (
        "It looks like you're guessing a bit too early. For example, in the conversation between " +
        convoData.find((item) => item.guessIndex < item.answerIndex - 1).people +
        ", try waiting a bit longer before making a decision."
      );
    } else if (
      convoData.some((item) => item.guessIndex > item.answerIndex * 2)
    ) {
      return (
        "You may need to review some conversations more carefully. For instance, in the conversation between " +
        convoData.find((item) => item.guessIndex > item.answerIndex * 2).people +
        ", your guess was very late. Take time to look for clues in the conversation before deciding."
      );
    } else {
      return "You're on the right track honestly. You'll have an advantage when you get conversations that you've already seen.";
    }
  };

  const perfectOptions = [
    "Precisely right!",
    "On the money!",
    "Nailed it!",
    "You did awesome! This is it.",
    "This is the right answer!",
    "How did you know it was this one?",
  ];

  // Return the method for external use.
  // You can also return JSX here if this component has any UI elements.
  return { calculateScoreMessage, tipForScores, perfectOptions };
};

export default ScoreHandler;
