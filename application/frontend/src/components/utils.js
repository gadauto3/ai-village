export function isLocalHost() {
  if (
    typeof window !== "undefined" &&
    window.location.host.includes("localhost")
  ) {
    console.log("You are running on localhost!");
    return true;
  } else {
    return false;
  }
}

export const GameState = Object.freeze({
  INIT: 1,
  NEXT_CONVO: 2,
  NOTICE_AI: 3,
  SELECT_AI: 4,
  MOVE_CONVOS: 5,
  INTERACT: 6,
  SHOW_CREDITS: 7,
}); 

export const MAX_CONVOS = 7;

export const config = {
  apiPrefix: "/dev",
};

export const iconsPath = (isLocalHost() ? ".." : config.apiPrefix) + "/images/";

// TODO: fix deployment system so I can just use lodash
export function deepCopy(obj) {
  if (obj === null) return null;
  if (typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    const copy = obj.slice();
    for (let i = 0; i < copy.length; i++) {
      copy[i] = deepCopy(copy[i]);
    }
    return copy;
  } else {
    const copy = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        copy[key] = deepCopy(obj[key]);
      }
    }
    return copy;
  }
}

export const makeMockLines = (lines) => {
  const mockTexts = [
      "Mind blown!",
      "Really? I didn't know that!",
      "You always have such cool facts!",
      "That's so interesting!",
      "You're so smart!",
      "That's amazing.",
      "Tell me more!"
  ];

  const getRandomText = () => mockTexts[Math.floor(Math.random() * mockTexts.length)];

  const numberOfLines = Math.floor(Math.random() * 4) + 3;  // Generate random number between 3 and 6 inclusive
  const mockLines = [];
  const lastNames = [lines[lines.length - 2].name, lines[lines.length - 1].name];

  for (let i = 0; i < numberOfLines; i++) {
      mockLines.push({
          name: lastNames[i % 2],
          message: null,
          text: getRandomText()
      });
  }

  return mockLines;
}
