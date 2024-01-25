const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const OpenAI = require("openai");
const logger = require('./logger');
const { response } = require('express');
const ConversationAdapter = require('./conversationAdapter');

const ssm = new AWS.SSM();
// Read and clean up the prompt text
const systemPromptTextFromFile = fs.readFileSync(path.join(__dirname, 'system-prompt.txt'), 'utf8').trim().replace(/\s+/g, ' ');
const userPromptTextFromFile = fs.readFileSync(path.join(__dirname, 'user-prompt.txt'), 'utf8').trim().replace(/\s+/g, ' ');
const userInputPromptTextFromFile = fs.readFileSync(path.join(__dirname, 'user-input-prompt.txt'), 'utf8').trim().replace(/\s+/g, ' ');
// Act-oriented prompts
const userPromptAct1 = fs.readFileSync(path.join(__dirname, 'user-prompt-act1.txt'), 'utf8').trim().replace(/\s+/g, ' ');
const userPromptAct2 = fs.readFileSync(path.join(__dirname, 'user-prompt-act2.txt'), 'utf8').trim().replace(/\s+/g, ' ');
const userPromptAct3 = fs.readFileSync(path.join(__dirname, 'user-prompt-act3.txt'), 'utf8').trim().replace(/\s+/g, ' ');
const userInputPromptAct1 = fs.readFileSync(path.join(__dirname, 'user-input-prompt-act1.txt'), 'utf8').trim().replace(/\s+/g, ' ');
const userInputPromptAct2 = fs.readFileSync(path.join(__dirname, 'user-input-prompt-act2.txt'), 'utf8').trim().replace(/\s+/g, ' ');
const userInputPromptAct3 = fs.readFileSync(path.join(__dirname, 'user-input-prompt-act3.txt'), 'utf8').trim().replace(/\s+/g, ' ');


class ConversationExtender {
  constructor() {

    this.isInitialized = false;
    if (process.env.OPENAI_API_KEY){
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      this.isInitialized = true;
    } else {
    // Start trying to get the api key
      this.retrieveApiKey();
    }
  }

  async retrieveApiKey() {
    try {
        const params = {
            Names: ['/aivillage/apikeys/openai'],
            WithDecryption: true
        };

        const response = await ssm.getParameters(params).promise();

        response.Parameters.forEach(parameter => {
          if (parameter.Name === '/aivillage/apikeys/openai') {
              this.openaiApiKey = parameter.Value;
          }
        });
        
        if (!this.openaiApiKey) {
            console.error("Could not find the specified API key parameter.");
        } else {
            logger.info("Successfully retrieved API key.");
            this.openai = new OpenAI({ apiKey: this.openaiApiKey });
            this.isInitialized = true;
        }

    } catch (err) {
        console.error("Could not retrieve api key", err);
    }
  }
  
  adjustPrompt(userText, context) {

    // API needs better input, so specifying names of villagers
    const allNames = context.lines.map(line => line.name);
    const uniqueNames = [...new Set(allNames)];
    const currentContext = JSON.stringify(context).trim();
    const currentUsers = uniqueNames.join(' and ');
    const nextUser = allNames[allNames.length - 2];
    
    userText = userText.replace('CURRENT_CONTEXT', currentContext);
    userText = userText.replace(/CURRENT_USERS/g, currentUsers);
    userText = userText.replace(/NEXT_USER/g, nextUser);

    return userText.trim();
  }

  adjustPromptWithPlayerInfo(prompt, playerName, playerMessage) {
    let newPrompt = userInputPromptTextFromFile;

    newPrompt = newPrompt.replace(/PLAYER_NAME/g, playerName);
    newPrompt = newPrompt.replace('PLAYER_MESSAGE', playerMessage);
    
    return prompt + newPrompt;
  }
  
  removeOthersFromLines(originalLines, newLines) {
    // Get the names from the original conversation lines
    const originalNames = originalLines.map(line => line.name);
    // Filter out lines that do not belong to these names
    return newLines.filter(line => originalNames.includes(line.name));
  }

  extractUniqueNames(lines) {
    if (lines === undefined) {
      return [];
    }
    return lines
        .map(entry => entry.name)  // Extract all names
        .filter((name, index, self) => self.indexOf(name) === index);  // Filter out duplicates
  }
  
  removeMatchingElements(priorArray, newArray) {
    const priorArrayMap = new Map();
  
    for (const item of priorArray) {
      const key = `${item.name}-${item.text}`;
      priorArrayMap.set(key, true);
    }
  
    return newArray.filter(item => {
      const key = `${item.name}-${item.text}`;
      return !priorArrayMap.has(key);
    });
  }
  
  async extendConversationWithUser(context, act, callback) {
    const playerName = context.playerName;
    const playerLine = context.playerMessage;
    if (!playerName || !playerLine) {
      const err = `Invalid values for player name (${playerName}) or message (${playerLine})`;
      logger.info(err);
      callback(err, null);
    }
    
    const filteredLines = context.lines.map((convo) => {
      delete convo.message;
      return convo;
    });
    let prompt = this.adjustPrompt(this.promptForAct(act, true), {
      lines: filteredLines,
    });
    prompt = this.adjustPromptWithPlayerInfo(prompt, playerName, playerLine);

    this.callOpenAI(prompt, filteredLines, act, callback);
  }

  promptForAct(act, isUserInput=false) {
    logger.info({act: act, isUserInput: isUserInput});
    if (isUserInput) {
      switch(act) {
        case 1: return userInputPromptAct1;
        case 2: return userInputPromptAct2;
        case 3: return userInputPromptAct3;
        default: console.error("Unexpected act", act); 
          return userInputPromptTextFromFile;
      }
    } else {
      switch(act) {
        case 0: userPromptTextFromFile;
        case 1: return userPromptAct1;
        case 2: return userPromptAct2;
        case 3: return userPromptAct3;
        default: console.error("Unexpected input act", act); 
          return userPromptTextFromFile;
      }
    }
  }

  async extendConversation(context, act, callback) {

    const fullContext = this.adjustPrompt(this.promptForAct(act), context); // Use the cleaned-up prompt

    const filteredLines = context.lines.map((convo) => {
      delete convo.message;
      return convo;
    });
    this.callOpenAI(fullContext, filteredLines, act, callback);
  }

  async callOpenAI(fullContext, originalLines, act, callback, playerName = null) {

    let responseCapture = "uninitialized";
    if (!this.isInitialized) {
      let timeout = 5000;
      await new Promise(resolve => setTimeout(resolve, timeout)); // wait for 5s
    }

    const startTime = new Date(); // Start time before API call

    this.openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        { "role": "system", "content": systemPromptTextFromFile },
        { "role": "user",   "content": fullContext }
      ],
      temperature: 1.2,
      max_tokens: 768,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    .then(response => {
      const endTime = new Date(); // End time after API response
      const apiCallTime = (endTime - startTime) / 1000; // Calculate duration in seconds
      // if (apiCallTime > 30) {
        logger.info({context: fullContext});
      // }
  
      // Check if the response is valid JSON
      try {
        // Safely extract the text part
        responseCapture = "got a response"
        const message = response.choices[0].message;
        responseCapture = message.content;

        // Extract json if there's words around it from gpt
        const jsonRegex = /(\[.*\]|\{.*\})/s;
        const people = `${originalLines[0].name} & ${originalLines[1].name}`;
        logger.info({act: act, callTime: apiCallTime, people: people, response: responseCapture});
        const match = responseCapture.match(jsonRegex);
        let responseJson = "before match";
        if (match) {
          const validJsonString = match[0];
          responseJson = JSON.parse(validJsonString);
        } else {
          throw new Error("No valid JSON matched from the response.");
        }

        // Sometimes I just get back an array of lines which is reasonable
        responseJson = Array.isArray(responseJson) ? {"lines":responseJson} : responseJson;
        // TODO: remove this debugging, but it's helpful right now.
        const len1 = responseJson.lines.length;
        let responseLines = this.removeMatchingElements(originalLines, responseJson.lines);
        const len2 = responseLines.length;
        let len3 = -1;
        responseLines = this.removeOthersFromLines(originalLines, responseLines);
        len3 = responseLines.length;
        responseLines = ConversationAdapter.adaptLines(responseLines);
        const len4 = responseLines.length;
        logger.info({initialLen: len1, removeMatchingLen: len2, removeOthersLen: len3, adaptLinesLen: len4, names: this.extractUniqueNames(responseLines)});
        console.log("222");
        callback(null, responseLines);
        console.log("333");
      } catch (e) {
        console.error("Problematic message:\n", responseCapture, "with context:\n", fullContext);
        callback(e, null);
      }
    })
    .catch(err => {
      logger.error(err, {responseContent: responseCapture.content});
      callback(err, null);
    });
  }

}

module.exports = ConversationExtender;
