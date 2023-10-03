import React, { useState, useEffect, useRef } from "react";
import { isLocalHost, deepCopy, config } from './utils';
import { InstructionsNoticeAI, InstructionsStageTwo, InstructionsStart, peopleNames, ramblingSentence, tipForEarlyGuess, tipForGoodGame } from "./longStrings";
import Conversation from './Conversation';
import ModalPopup from "./ModalPopup";
import Scoreboard from './Scoreboard';
import ScoreCalculator from './ScoreCalculator';
import UserTokens from './UserTokens';
import "../css/Village.css";
import "../css/utils.css";

const MAX_CONVOS = 7;

const Village = () => {
  const [conversations, setConversations] = useState([]);
  const [scores, setScores] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [areStatsShown, setAreStatsShown] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalEntryLength, setModalEntryLength] = useState(-1);
  const [modalButtonText, setModalButtonText] = useState("");
  const [lastSelectedConversation, setLastSelectedConversation] = useState(-1);
  const [randSeed, setRandSeed] = useState(new Date().toISOString());
  const [isApiSuccess, setIsApiSuccess] = useState(false);
  const [isStageTwo, setIsStageTwo] = useState(false);
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

  useEffect(() => {
    if (isStageTwo) {
      document.body.style.backgroundColor = "black";
    } else {
      document.body.style.backgroundColor = ""; // Reset to default
    }
  }, [isStageTwo]);

  const handleScoreNotice = (index) => {
    let updatedScores = [...scores];

    if (scoreNoticeButtonTitle == "Continue") {
      setIsStageTwo(true);
      return;
    } else if (index < 0 || updatedScores[index] > 0) {
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
      const recommendation = didGuessEarly ? tipForEarlyGuess : tipForGoodGame;
      setScores([...newScores]);
      setTotalScore(newTotalScore);
      setScoreNoticeButtonTitle("Continue");

      // Display the end-of-stage modal dialog
      setModalText('Thank you so much for playing! Tip for next time:' + recommendation);
      setModalButtonText('Ok');
      setTimeout(() => {
        setShowModal(true);
      }, 200);
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
          alert(
            "Sorry, failed to retrieve conversations due to an error, try refreshing.\n" +
              err
          );
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
    const names = peopleNames;
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
          text: `I'm doing great, thanks ${personA}! How about you?`,
        },
        {
          name: personA,
          text: ramblingSentence,
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

  // Function to handle the checkbox change
  const handleCheckboxChange = (event) => {
    setAreStatsShown(event.target.checked); 
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
    <div className={`container ${isStageTwo ? "stage-two" : ""}`}>
      <h1 className="display-4 text-center title-noto-sans">
        VillAIge of Wonder
      </h1>
      {!isRetrieveCalled ? <InstructionsStart /> : null}

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
          <div className="conversation-row">
            {" "}
            {/* You might need to style this row to ensure proper alignment */}
            <Conversation
              key={index}
              data={conversation}
              isApiSuccess={isApiSuccess}
              isPhaseTwo={isStageTwo}
              isPurchasing={isPurchasing}
              apiPrefix={config.apiPrefix}
              updateConversationLines={updateConversationLines}
              areStatsShowing={areStatsShown}
              updateLineIndex={(newLineIndex) =>
                updateLineIndexForConversation(index, newLineIndex)
              }
            />
          </div>
        ))}
      </div>
      <div>
        {/* This double isRetrieveCalled allows the text to fade in while not taking up a lot of space before it shows up */}
        <p
          className={`more-spacing fade-in ${
            isRetrieveCalled ? "visible" : ""
          }`}
        >
          {isRetrieveCalled && !isStageTwo && <InstructionsNoticeAI />}
          {isStageTwo && <InstructionsStageTwo />}
        </p>
        {isStageTwo && (
          <UserTokens
            isEnabled={!isPurchasing}
            buttonPressed={(index) =>
              setIsPurchasing(true)
            }
          />
        )}
      </div>

      {!isStageTwo && (
        <Scoreboard
          conversations={conversations}
          scores={scores}
          lastSelectedConversation={lastSelectedConversation}
          totalScore={totalScore}
          handleScoreNotice={handleScoreNotice}
          scoreNoticeButtonTitle={scoreNoticeButtonTitle}
          isApiSuccess={isApiSuccess}
        />
      )}

      {isStageTwo && (
        <div>
          <input
            type="checkbox"
            id="statsCheckbox"
            className="spacing"
            checked={areStatsShown}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="statsCheckbox">See stats</label>
        </div>
      )}

      <div>
        <ModalPopup
          isVisible={showModal}
          textToDisplay={modalText}
          buttonText={modalButtonText}
          entryLength={modalEntryLength}
          onClose={(value) => {
            console.log("Entered value:", value);
            setShowModal(false);
          }}
        />
      </div>
    </div>
  );
};

export default Village;
