import React, { useState, useEffect } from "react";
import Person from "./Person";
import TargetVisualizer from './TargetVisualizer';
import { iconsPath, isLocalHost } from "./utils";
import { patienceRequest } from "./longStrings";
import "../css/Conversation.css";
import "../css/utils.css";

import tokenImage from '../assets/images/token.png';
import token48Image from '../assets/images/token48.png';

function Conversation({
  data,
  apiPrefix,
  updateConversationLines,
  updateLineIndex,
  playerName,
  setPlayerName,
  isApiSuccess,
  isPhaseTwo,
  isPurchasing,
  areStatsShowing,
  purchaseMade,
  purchaseCompleted,
  showModal
}) {
  const [people, setPeople] = useState(createPeople(data.people, data.color));
  const [numAddedLines, setNumAddedLines] = useState(0);
  const [arePersonsMuted, setArePersonsMuted] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isInputUnlocked, setIsInputUnlocked] = useState(false);
  const [isReadyForInput, setIsReadyForInput] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [inputError, setInputError] = useState(null);
  const [userInput, setUserInput] = useState(null);
  const [lastPerson, setLastPerson] = useState(null);

  useEffect(() => {
    const newPeople = createPeople(data.people, data.color);
    setPeople(newPeople);
  }, [data.people, data.color]);

  function createPeople(people, color) {
    const personMap = {};

    people.forEach((person) => {
      if (!personMap[person.name]) {
        personMap[person.name] = {
          name: person.name,
          currentLine: person.currentLine,
          icon: iconsPath + person.icon,
          opacity: 1,
          color: color || "#FFF",
        };
      } else {
        personMap[person.name].currentLine = person.currentLine;
      }
    });
    return Object.values(personMap);
  }

  function retrieveAdditionalConversationWithUserInput(person) {
    if (isFetching || isLocalHost()) {
      return;
    }
    setIsFetching(true);
    console.log("retrieveAdditionalConversationWithUserInput", person);

    const currentLines = data.lines;
    fetch(apiPrefix + "/api/addPlayerToConversation", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lines: currentLines, playerName: playerName, playerMessage: userInput }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("responseData", responseData);
        if (responseData.moreLines.length) {
          setNumAddedLines(responseData.moreLines.length);
          const addedLines = data.lines.concat(responseData.moreLines);
          updateConversationLines(data, addedLines);
        } else {
          updateConversationForPhaseOne(person, false);
        }
        cleanupAfterAPICall(person, true);
      })
      .catch((err) => {
        cleanupAfterAPICall(person, true);
      });
  }

  function retrieveAdditionalConversation(person) {
    console.log("retrieveAdditionalConversation");
    if (isFetching || isLocalHost()) {
      return;
    }
    setIsFetching(true);

    const currentLines = data.lines;
    fetch(apiPrefix + "/api/addToConversation", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lines: currentLines }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.moreLines.length) {
          setNumAddedLines(responseData.moreLines.length);
          const addedLines = data.lines.concat(responseData.moreLines);
          updateConversationLines(data, addedLines);
        } else {
          updateConversationFor(person, false);
        }
        cleanupAfterAPICall(person, false);
      })
      .catch((err) => {
        // TODO: Maybe put an error modal here
        cleanupAfterAPICall(person, false);
      });
  }

  function cleanupAfterAPICall(person, didPlayerSpeak) {
    setIsFetching(false);
    setArePersonsMuted(false);
    setIsReadyForInput(false);

    if (didPlayerSpeak) {
      purchaseCompleted();
      setIsInputUnlocked(false);
      setUserInput("");
      setLastPerson(null);
    }
  }

  function updateConversationFor(person, canUseAPI) {
    if (isPhaseTwo) {
      updateConversationForPhaseTwo(person, canUseAPI);
    } else {
      updateConversationForPhaseOne(person, canUseAPI);
    }
  }

  function updateConversationForPhaseTwo(person, canUseAPI) {
    let newIndex = data.currentLineIndex + 1;
    
    if (newIndex === data.lines.length - 1 && canUseAPI) {
      setIsReadyForInput(true);
      setLastPerson(person);
    }

    updatePeopleInConversation(newIndex, person);
  }

  function updateConversationForPhaseOne(person, canUseAPI) {
    let newIndex = data.currentLineIndex + 1;

    if (newIndex === data.lines.length - 4 && canUseAPI) {
      retrieveAdditionalConversation(person);
    }

    // If out of lines
    if (newIndex >= data.lines.length) {
      if (isFetching) {
        alert(patienceRequest);
        setArePersonsMuted(true); // Re-enable buttons after showing alert
      } else {
        const updatedPeople = people.map((p) => {
          if (p.name === person.name) {
            return {
              ...p,
              currentLine: "Oops, I'm out of ideas",
              opacity: 1,
            };
          }
          return p;
        });
        setPeople(updatedPeople);
      }
      return;
    }

    updatePeopleInConversation(newIndex, person);
  }

  function updatePeopleInConversation(newIndex, person) {
    const nextLine = data.lines[newIndex];

    // If the person is the speaker of the next line
    if (nextLine.name === person.name) {
      const updatedPeople = people.map((p) => {
        if (p.name === nextLine.name) {
          return {
            ...p,
            opacity: 1,
            currentLine: nextLine.text,
          };
        } else {
          return {
            ...p,
            opacity: 0.65,
          };
        }
      });
      setPeople(updatedPeople);
      updateLineIndex(newIndex);
    } else {
      // If the person is not the speaker of the next line
      const reminder =
        person.currentLine.length < 5 ? ""
          : `Remember, I said, "${person.currentLine}"`;
      const updatedPeople = people.map((p) => {
        if (p.name === person.name) {
          return {
            ...p,
            currentLine: `Would you check with ${nextLine.name}? ${reminder}`,
          };
        }
        return p;
      });
      setPeople(updatedPeople);
    }
  }

  function enterName() {
    showModal({
      textToDisplay: `Please provide your name for ${people[0].name} and ${people[1].name}. Note: your name will be used only for this round of the game.`,
      buttonText: "Done",
      entryLengthMin: 3,
      entryLengthMax: 20,
      onClose: (entry) => {
        setPlayerName(entry);
      }
    });
  }

  function verifyTextAndSubmit(text) {
    console.log("lastPerson", lastPerson);
    setInputError(null);
    const maxChars = 140;
    const entry = text.trim();
    const regex = /^[a-zA-Z0-9-. ,()'!?]+$/;
    if (entry.length < 20) {
      setInputError(`Please provide a longer sentence with more details, up to ${maxChars} characters.`);
    } else if (entry.length > maxChars) {
      setInputError(`Sorry, please use less than ${maxChars} characters in your message. It is currently ${entry.length}.`);
    } else if (!regex.test(entry)) {
      setInputError(`Please use only letters, numbers, .-,()'!? and space characters.`);
    } else if (!playerName) {
      setInputError(`One thing ☝🏽. Would you provide a name to the villagers by clicking the "You" button?`);
    }

    if (inputError) {
      return;
    }

    retrieveAdditionalConversationWithUserInput(lastPerson);
  }

  function spendToken() {
    setIsInputUnlocked(true);
    purchaseMade();
  }

  function calculateFill() {
    if (numAddedLines === 0) {
      const numLines = Math.min(4, data.lines.length - data.currentLineIndex);
      setNumAddedLines(numLines);
    }

    const indexDelta = data.lines.length - data.currentLineIndex - 1;
    return (numAddedLines - indexDelta) / numAddedLines;
  }

  return (
    <div
      className={`conversation-container more-spacing rounded-div 
        ${isPhaseTwo ? "glowing-border" : ""}`}
    >
      <div className="persons-container">
        {people.map((person, index) => (
          <Person
            key={index}
            data={person}
            color={person.color}
            isMuted={arePersonsMuted || isPurchasing || isReadyForInput}
            isApiSuccess={isApiSuccess}
            updateLine={() => updateConversationFor(person, true)}
            isClickable={data.lines.length > 0}
          />
        ))}

        {isInputUnlocked && (
          <div
            className="d-flex align-items-center mt-2 rounded-div you-container"
            style={{ opacity: isReadyForInput ? 1 : 0.15 }}
          >
            <button
              className="mr-2 wide-btn spacing rounded-btn"
              type="button" /*disabled*/
              disabled={playerName}
              onClick={() => enterName()}
            >
              {playerName ? playerName : "You"}
            </button>
            <button
              className="conv-token-icon icon mr-2 spacing"
              style={{ backgroundImage: `url(${token48Image})` }}
              disabled={!isReadyForInput || isFetching}
              onClick={() => verifyTextAndSubmit(userInput)}
            ></button>
            {isReadyForInput && (
              <textarea
                rows="2"
                className="form-control spacing no-shadow"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter your message for the conversation here then click the token to submit..."
              ></textarea>
            )}
            {!isReadyForInput && (
              <input
                type="text"
                className="form-control spacing no-shadow"
                disabled
              />
            )}
          </div>
        )}

        {inputError && (
          <div className="spacing-top">
            {inputError}<br />
          </div>
        )}

        {areStatsShowing && (
          <div className="spacing-top">
            Conversation stats: Total lines: {data.lines.length} on:{" "}
            {data.currentLineIndex + 1} Just added by AI:{" "}
            {hasFetched ? numAddedLines : 0}
          </div>
        )}
      </div>
      {isPhaseTwo && !isPurchasing && (
        <TargetVisualizer
          numberOfRings={numAddedLines}
          useRed={false}
          fillAmount={calculateFill()}
        />
      )}

      {isPhaseTwo && isPurchasing && (
        <button
          onClick={() => spendToken()}
          className={`conv-token-button`}
          style={{ backgroundImage: `url(${tokenImage})` }}
        />
      )}
    </div>
  );
}

export default Conversation;
