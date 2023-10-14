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
  NOTICE_AI: 2,
  INTERACT: 3,
  SHOW_CREDITS: 4,
}); 

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
