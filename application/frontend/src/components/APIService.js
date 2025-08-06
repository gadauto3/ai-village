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

export const retrieveAdditionalConversation = (context, numApiCalls, onSuccess, onError) => {
    const endPoint = `/api/addToConversation?numApiCalls=${numApiCalls}`;
    console.log("endPoint", endPoint);

    const startTime = new Date();
    const requestBody = {
      context: context,
      action: "add_to_conversation"
    };
    console.log("MCP Request Context:", JSON.stringify(requestBody, null, 2));

    fetch(config.apiPrefix + endPoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((responseData) => {
        const durationInSeconds = (new Date() - startTime) / 1000;
        console.log("MCP Response Context:", JSON.stringify(responseData, null, 2));
        console.log("responseData in", durationInSeconds, "seconds:", responseData);
        if (responseData.context && responseData.context.conversation && responseData.context.conversation.length) {
            onSuccess(responseData.context.conversation, durationInSeconds);
        } else {
            onError("Did not receive additional lines");
        }
      })
      .catch((err) => {
        onError(err);
      });
  }

  export const retrieveAdditionalConversationWithUserInput = (userName, userInput, numApiCalls, lines, onSuccess, onError) => {
    const endPoint = `/api/addPlayerToConversation?numApiCalls=${numApiCalls}`;
    console.log("endPoint", endPoint);

    const startTime = new Date();
    fetch(config.apiPrefix + endPoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lines: lines,
        playerName: userName,
        playerMessage: userInput,
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        const durationInSeconds = (new Date() - startTime) / 1000;
        console.log("responseData in", durationInSeconds, "seconds:", responseData);
        if (responseData.moreLines.length) {
            onSuccess(responseData.moreLines, durationInSeconds);
        } else {
            onError("Did not receive additional lines");
        }
      })
      .catch((err) => {
        onError(err);
      });
  }
