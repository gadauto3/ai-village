import React from "react";

export const InstructionsStart = () => (
  <p>
    Start by using Add Conversation. The more conversations you choose to add,
    the higher the potential score.
    <br />
    When you've finished adding, click Begin.
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
    Now it's time to discover how the AI behaves and reacts to your input.<br />
    Select your favorite conversation and use a token below to influence the
    villagers. The targets show you the countdown until the change. You may 
    choose to observe as the conversation evolves, or use tokens to change it.
  </React.Fragment>
);

export const tipForEarlyGuess =
  "I see you guessed too early on at least one conversation.\
  \nGuessing early is worse than guessing late.";
export const tipForGoodGame =
  "You're on the right track honestly. You'll have\n\
  an advantage when you get conversations that you've already seen.";

export const patienceRequest = 
  "Hi, this is Gabriel. Thanks for your patience with this prototype.\
  \nWould you try another conversation or this one again in 5 seconds?";

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
  "Lianna",
  "Camden",
];
