import React from "react";

export const aiStartsHereMsg = "AI-created conversation starts here";

export const InstructionsInit =
  'Use "Add conversation" to add more conversations to the game. The more you\
  add, the higher the possible score, but it may make the game more difficult.';

export const InstructionsNextConvo =
  'First select a messenger group above. Then, use "Next" to get more messages\
  from the conversation.';

export const InstructionsNoticeAI2 =
  'Now your goal is to select the "I\'m noticing AI generation" button when you\
  notice that the AI (who thinks it\'s a writer making up dialogue) is creating\
  further conversation between the people. HINT: the shortest conversation is 7 messages\
  so don\'t click right away.';

export const InstructionsSelectAI =
  'Choose which conversation you think the AI began to write the dialogue.\
  Then click "Submit guess".';

export const InstructionsMoveConvos = "Great! ☝🏽 Now select another conversation and\
  click \"Next\" to move it along. You got some feedback on your choice but we'll review\
  results later as well.";

export const InstructionsCelebrate = "🎉 Celebrate your effort! 🎉";

export const InstructionsInteract =
  "Now it's time to discover how the AI behaves and reacts to your input. You have\
  3 chances per game to add input to conversations.";

export const InstructionsJoinConvo =
  "Press Next until it's time to join. Then enter your message into the text thread\
  followed by sending it with ⬆️";

export const InstructionsShowCredits =
  'Hope you\'re enjoying the game!';

export const ramblingSentence = `I'm good. I'm going blab on a bit because\
  I need to test a rather long text where people will read what I say in my\
  words for the birds and I really don't like curds.`;

export const userNameError = `Would you please provide a name?`;

export const validateMessage = (userInput, userName, maxChars = 140) => {
  const entry = userInput.trim();
  const regex = /^[a-zA-Z0-9-. ,()\'!?]+$/;
  
  if (entry.length < 20) {
    return `Please provide a longer sentence with more details, up to ${maxChars} characters.`;
  } else if (entry.length > maxChars) {
    return `Sorry, please use less than ${maxChars} characters in your message. It is currently ${entry.length}.`;
  } else if (!regex.test(entry)) {
    return `Please use only letters, numbers, .-,()\'!? and space characters.`;
  } else if (!userName) {
    return userNameError;
  }
  
  return null;  // No error
}

export const retrieveConvoError =
  "Sorry, failed to retrieve conversations due to an error, try pressing again or if that fails, refresh the page.\n";

export const peopleNames = [
  "George",
  "Carlos",
  "Jimena",
  "Vanessa",
  "Chris",
  "Cri-Cri",
  "Leo",
  "Lianna",
  "Camden",
];
