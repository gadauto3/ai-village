import { config } from "./utils";

// Initialize randSeed
let randSeed = new Date().toISOString();

// Function to get the current randSeed value
export const getCurrentRandSeed = () => randSeed;

// Function to set a new randSeed value
export const setRandSeed = (newSeed) => {
  randSeed = newSeed;
};

export const getConversations = (numConvos, onSuccess, onError) => {
  const seed = JSON.stringify(randSeed);
  const apiPath = `/api/getConversations?numConvos=${numConvos}&seed=${seed}`;

  fetch(config.apiPrefix + apiPath, {
      method: "GET",
      headers: {
          accept: "application/json",
      },
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
  })
  .then(responseValue => {
      onSuccess(responseValue.conversations);
  })
  .catch(err => {
      console.error("getConversations api error:", err);
      onError(err);
  });
};
