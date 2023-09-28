import React, { useState, useEffect } from "react";
import Person from "./Person";
import { iconsPath, isLocalHost } from "./utils";

function Conversation({
  data,
  apiPrefix,
  updateConversationLines,
  updateLineIndex,
  isApiSuccess,
}) {
  const [people, setPeople] = useState(createPeople(data.people, data.color));
  const [isFetching, setIsFetching] = useState(false);
  const [arePersonsMuted, setArePersonsMuted] = useState(false);

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
      .then((data) => {
        if (data.moreLines.length) {
          const addedLines = data.lines.concat(data.moreLines);
          updateConversationLines(data, addedLines);
        } else {
          updateConversationFor(person, false);
        }
        setIsFetching(false);
        setArePersonsMuted(false);
      })
      .catch((err) => {
        updateConversationFor(person, false);
        setIsFetching(false);
        setArePersonsMuted(false);
      });
  }

  function updateConversationFor(person, canUseAPI) {
    let newIndex = data.currentLineIndex + 1;

    if (newIndex === data.lines.length - 4) {
      if (canUseAPI && !isFetching && !isLocalHost()) {
        retrieveAdditionalConversation(person);
      }
    }

    // If out of lines
    if (newIndex >= data.lines.length) {
      if (isFetching) {
        alert(
          "Hi, this is Gabriel. Thanks for your patience with this prototype.\nWould you try another conversation or this one again in 5 seconds?"
        );
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

    const nextLine = data.lines[newIndex];

    // If the person is the speaker of the next line
    if (nextLine.name === person.name) {
      const updatedPeople = people.map((p) => {
        if (p.name === nextLine.name) {
          return {
            ...p,
            currentLine: nextLine.text,
            opacity: 1,
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
        person.currentLine.length < 5
          ? ""
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

  return (
    <div>
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
    </div>
  );
}

export default Conversation;
