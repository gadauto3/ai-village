import React, { useState, useEffect, useRef } from "react";
import { isLocalHost, deepCopy, config } from './utils';
import Conversation from './Conversation';
import Scoreboard from './Scoreboard';
import ScoreCalculator from './ScoreCalculator';
import "../css/Village.css";
import "../css/utils.css";

const MAX_CONVOS = 7;

const Village = () => {
  const [conversations, setConversations] = useState([]);
  const [scores, setScores] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [lastSelectedConversation, setLastSelectedConversation] = useState(-1);
  const [randSeed, setRandSeed] = useState(new Date().toISOString());
  const [isApiSuccess, setIsApiSuccess] = useState(false);
  const [isRetrieveCalled, setIsRetrieveCalled] = useState(false);
  const [scoreCalculator, setScoreCalculator] = useState(null);
  const [scoreNoticeButtonTitle, setScoreNoticeButtonTitle] = useState(
    "I'm noticing AI generation"
  );

  const retrieveBtn = useRef(null);
  const defaultHeadIcon = "icons8-head-profile-50.png";
  let colorIndex = 0;

  // One time, at loading, print the randSeed and instructions
  useEffect(() => {
    console.log(`window.villageComponent.setRandSeed("${randSeed}")`);
  }, []);

  const handleScoreNotice = (index) => {
    let updatedScores = [...scores];

    if (index < 0 || updatedScores[index] > 0) {
      return; // Score already calculated
    }
    const convoIndex = conversations[index].currentLineIndex;
    const newScores = scoreCalculator.updateScoresForIndex(index, convoIndex);

    const newTotalScore = scoreCalculator.getTotalScore();
    const hasZero = newScores.some((num) => num === 0);
    // When all zeroes are gone, the player has guessed every conversation and can play again.
    if (hasZero) {
      setScores([...newScores]);
      setTotalScore(newTotalScore);
    } else {
      const didGuessEarly = newScores.some((num) => Math.abs(num % 2) === 1);
      const recommendation = didGuessEarly
        ? "I see you guessed too early on at least one\nconversation which is worse than guessing late."
        : "You're on the right track honestly. You'll have\nan advantage when you get conversations that you've already seen.";
      setScores([...newScores]);
      setTotalScore(newTotalScore);
      setScoreNoticeButtonTitle("Try again");
      setTimeout(() => {
        alert(
          'Thank you so much for playing!\nTo play again, click "Try again".\nTip for next time:' +
            recommendation
        );
      }, 1000);
    }
  };

  const addConversation = () => {
    if (conversations.length < MAX_CONVOS) {
      const convo = makeStartingConversation(conversations.length + 1);
      setConversations([...conversations, convo]);
    }
  };

  useEffect(() => {
    // This effect will run whenever `conversations` changes.
    if (isApiSuccess && scoreCalculator === null) {
      // Only run if API call was a success
      setScoreCalculator(
        new ScoreCalculator(conversations.map((conv) => conv.lines.length))
      );
    }
  }, [conversations, isApiSuccess, scoreCalculator]);

  const retrieveConversations = () => {
    retrieveBtn.current.disabled = true; // Disable the Retrieve button
    setIsRetrieveCalled(true);

    const seed = JSON.stringify(randSeed);
    const apiPath = "/api/getConversations?numConvos=" +
      conversations.length + "&seed=" +
      seed;
    fetch(config.apiPrefix + apiPath, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((village) => {
        setConversations(village.conversations);
        setIsApiSuccess(true);
      })
      .catch((err) => {
        console.log("retrieveConversations api error\n", err);

        if (isLocalHost()) {
          makeMockLines();
        } else {
          alert("Sorry, failed to retrieve conversations due to an error, try refreshing.\n" + err);
        }
      });
  };

  const updateConversationLines = (conversation, lines) => {
    const updatedConversations = conversations.map((c) => {
      if (c === conversation) {
        c.lines = lines;
      }
      return c;
    });
    setConversations(updatedConversations);
  };

  const updateLineIndexForConversation = (index, newLineIndex) => {
    const updatedConversations = [...conversations];
    updatedConversations[index].currentLineIndex = newLineIndex;
    setConversations(updatedConversations);
    setLastSelectedConversation(index);
  };

  const makeStartingConversation = (id) => {
    // Generate HTML-friendly rainbow colors
    const colors = ["#F5F5F5", "#DCDCDC"];
    const rainbowColor = colors[colorIndex];
    colorIndex = (colorIndex + 1) % colors.length;

    const conversation = {
      color: rainbowColor,
      people: [
        {
          name: `Person ${id * 2 - 1}`,
          icon: defaultHeadIcon,
          currentLine: ``,
        },
        {
          name: `Person ${id * 2}`,
          icon: defaultHeadIcon,
          currentLine: ``,
        },
      ],
      lines: [],
      currentLineIndex: 0,
    };

    return conversation;
  };

  const makeMockLines = () => {
    const mockConversations = deepCopy(conversations);
    const names = [ "George", "Carlos", "Jimena", "Vanessa", "Chris", "Cri-Cri", "Leo", "Rosa", "Liliana", "Lianna", "Camden", ];
    let nameIndex = 0;
    mockConversations.forEach((conversation) => {
      const personA = names[nameIndex++];
      const personB = names[nameIndex++];
      conversation.people[0].name = personA;
      conversation.people[1].name = personB;

      // TODO: move down
      const lines = [
        {
          name: personA,
          text: `How are you, ${personB}?`,
        },
        {
          name: personB,
          text: `I'm doing great, thanks, ${personA}! How about you?`,
        },
        {
          name: personA,
          text: `I'm good. I'm going blab on a bit because I need to test a rather long text where people will read what I say in my words for the birds and I really don't like curds.`,
        },
        {
          name: personB,
          text: `I'm looking up.`,
        },
        {
          name: personA,
          text: `I'm hearing around.`,
        },
        {
          name: personB,
          text: `I'm finding time.`,
        },
      ];
      conversation.lines = lines;
    });
    setConversations(mockConversations);
    setIsApiSuccess(true);
  };

  // Allow overwriting for fun and debugging
  useEffect(() => {
    window.villageComponent = {
      getRandSeed: () => randSeed,
      setRandSeed: setRandSeed,
    };
  }, [randSeed]);

  const getRandSeed = () => {
    return randSeed;
  };

  const updateRandSeed = (newRandSeed) => {
    setRandSeed(newRandSeed);
  };

  // Render
  return (
    <div className="container">
      <h1 className="display-4 text-center title-noto-sans">VillAIge of Wonder</h1>

      {!isRetrieveCalled ? (
        <p>
          Start by using Add Conversation. The more conversations you choose to
          add, the higher the potential score.
          <br />
          When you've finished selecting, click Begin.
        </p>
      ) : null}

      {/* Conditional Rendering for "Add Conversation" Button */}
      {conversations.length < MAX_CONVOS - 1 && !isRetrieveCalled ? (
        <button
          className="btn btn-secondary ml-2"
          type="button"
          onClick={addConversation}
        >
          Add Conversation
        </button>
      ) : null}

      {!isRetrieveCalled ? (
        <button
          className="btn btn-secondary ml-2"
          type="button"
          onClick={retrieveConversations}
          disabled={!conversations.length}
          ref={retrieveBtn}
        >
          Begin
        </button>
      ) : null}
      <div className="tall-div">
        {conversations.map((conversation, index) => (
          <Conversation
            key={index}
            data={conversation}
            isApiSuccess={isApiSuccess}
            apiPrefix={config.apiPrefix}
            updateConversationLines={updateConversationLines}
            updateLineIndex={(newLineIndex) =>
              updateLineIndexForConversation(index, newLineIndex)
            }
          />
        ))}
      </div>
      <div>
        {/* This double isRetrieveCalled allows the text to fade in while not taking up a lot of space before it shows up */}
        <p className={`more-spacing fade-in ${isRetrieveCalled ? "visible" : ""}`}>
          {isRetrieveCalled &&
            <>
            Now your goal is to select the "I'm noticing AI generation" button{" "}
            <em>once per conversation</em> when you think you notice that the AI
            is creating further conversation between the villagers. The AI
            thinks that it is a playwright continuing the conversations between
            villagers.
            <br />
            The highest score is 15 per conversation. You can guess once per
            conversation. Refresh the page to start over.
            </>
          }
        </p>
      </div>

      <Scoreboard 
            conversations={conversations} 
            scores={scores} 
            lastSelectedConversation={lastSelectedConversation} 
            totalScore={totalScore} 
            handleScoreNotice={handleScoreNotice} 
            scoreNoticeButtonTitle={scoreNoticeButtonTitle} 
            isApiSuccess={isApiSuccess} 
        />
    </div>
  );
};

export default Village;
