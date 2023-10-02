import React from "react";

export const InstructionsStart = () => (
  <p>
    Start by using Add Conversation. The more conversations you choose to add,
    the higher the potential score.
    <br />
    When you've finished selecting, click Begin.
  </p>
);

export const InstructionsNoticeAI = () => (
  <React.Fragment>
    Now your goal is to select the "I'm noticing AI generation" button{" "}
    <em>once per conversation</em> when you think you notice that the AI is
    creating further conversation between the villagers. The AI thinks that it
    is a playwright continuing the conversations between villagers.
    <br />
    The highest score is 15 per conversation. You can guess once per
    conversation. Refresh the page to start over.
  </React.Fragment>
);

export const InstructionsStageTwo = () => (
  <React.Fragment>
    Now it's Time to discover how AI reacts to human input. The targets will 
    show you the countdown until the game requests more lines from the AI.
    You may choose to see how the conversation evolves, or you may use the 
    tokens below to influence the conversation with your own input.
  </React.Fragment>
);

export const tipForEarlyGuess =
  "I see you guessed too early on at least one conversation.\
  \nGuessing early is worse than guessing late.";
export const tipForGoodGame =
  "You're on the right track honestly. You'll have\n\
  an advantage when you get conversations that you've already seen.";

export const ramblingSentence = `I'm good. I'm going blab on a bit because\
  I need to test a rather long text where people will read what I say in my\
  words for the birds and I really don't like curds.`;

export const peopleNames = [
  "George",
  "Carlos",
  "Jimena",
  "Vanessa",
  "Chris",
  "Cri-Cri",
  "Leo",
  "Rosa",
  "Liliana",
  "Lianna",
  "Camden",
];
