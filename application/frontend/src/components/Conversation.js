import React, { useState, useEffect } from "react";
import Person from "./Person";
import TargetVisualizer from './TargetVisualizer';
import { iconsPath, isLocalHost } from "./utils";
import { patienceRequest } from "./longStrings";
import "../css/Conversation.css";
import "../css/utils.css";

import tokenImage from '../assets/images/token.png';

function Conversation({
  data,
  apiPrefix,
  updateConversationLines,
  updateLineIndex,
  isApiSuccess,
  isPhaseTwo,
  isPurchasing,
  areStatsShowing,
  purchaseMade
}) {
  const [people, setPeople] = useState(createPeople(data.people, data.color));
  const [numAddedLines, setNumAddedLines] = useState(0);
  const [arePersonsMuted, setArePersonsMuted] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

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

  function retrieveAdditionalConversation(person) {
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
        setIsFetching(false);
        setHasFetched(true);
        setArePersonsMuted(false);
      })
      .catch((err) => {
        updateConversationFor(person, false);
        setIsFetching(false);
        setArePersonsMuted(false);
      });
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
      retrieveAdditionalConversation(person);
    }
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
            isMuted={arePersonsMuted}
            isApiSuccess={isApiSuccess}
            updateLine={() => updateConversationFor(person, true)}
            isClickable={data.lines.length > 0}
          />
        ))}

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
          onClick={() => purchaseMade()}
          className={`conv-token-button`}
          style={{ backgroundImage: `url(${tokenImage})` }}
        />
      )}
    </div>
  );
}

export default Conversation;
