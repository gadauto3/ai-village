const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const OpenAI = require("openai");
const { response } = require('express');
const ConversationAdapter = require('./conversationAdapter');

const ssm = new AWS.SSM();
// Read and clean up the prompt text
const systemPromptTextFromFile = fs.readFileSync(path.join(__dirname, 'system-prompt.txt'), 'utf8').trim().replace(/\s+/g, ' ');
const userPromptTextFromFile = fs.readFileSync(path.join(__dirname, 'user-prompt.txt'), 'utf8').trim().replace(/\s+/g, ' ');
const userInputPromptTextFromFile = fs.readFileSync(path.join(__dirname, 'user-input-prompt.txt'), 'utf8').trim().replace(/\s+/g, ' ');

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
            console.log("Successfully retrieved API key.");
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
    userText = userText.replace('CURRENT_USERS', currentUsers);
    userText = userText.replace('NEXT_USER', nextUser);

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
  
  async extendConversationWithUser(context, callback) {
    const playerName = context.playerName;
    const playerLine = context.playerMessage;
    if (!playerName || !playerLine) {
      const err = `Invalid values for player name (${playerName}) or message (${playerLine})`;
      console.log(err);
      callback(err, null);
    }
    
    const filteredLines = context.lines.map((convo) => {
      delete convo.message;
      return convo;
    });
    let prompt = this.adjustPrompt(userPromptTextFromFile, {
      lines: filteredLines,
    });
    prompt = this.adjustPromptWithPlayerInfo(prompt, playerName, playerLine);

    this.callOpenAI(prompt, filteredLines, callback);
  }

  async extendConversation(context, callback) {

    const fullContext = this.adjustPrompt(userPromptTextFromFile, context); // Use the cleaned-up prompt

    const filteredLines = context.lines.map((convo) => {
      delete convo.message;
      return convo;
    });
    this.callOpenAI(fullContext, filteredLines, callback);
  }

  async callOpenAI(fullContext, originalLines, callback, playerName = null) {

    let responseCapture = "uninitialized";
    if (!this.isInitialized) {
      let timeout = 5000;
      await new Promise(resolve => setTimeout(resolve, timeout)); // wait for 5s
    }

    this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { "role": "system", "content": systemPromptTextFromFile },
        { "role": "user",   "content": fullContext }
      ],
      temperature: 1,
      max_tokens: 768,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    .then(response => {

      // Check if the response is valid JSON
      try {
        // Safely extract the text part
        responseCapture = "got a response"
        const message = response.choices[0].message;
        responseCapture = message;
        let responseJson = JSON.parse(message.content);

        // TODO: remove this debugging, but it's helpful right now.
        const len1 = responseJson.lines.length;
        let responseLines = this.removeMatchingElements(originalLines, responseJson.lines);
        const len2 = responseLines.length;
        let len3 = -1;
        responseLines = this.removeOthersFromLines(originalLines, responseLines);
        len3 = responseLines.length;
        responseLines = ConversationAdapter.adaptLines(responseLines);
        const len4 = responseLines.length;
        console.log("Initial: ", len1, "removeMatching", len2, "removeOthers", len3, "adaptLines", len4, "names", this.extractUniqueNames(responseLines));
        callback(null, responseLines);
      } catch (e) {
        console.log("Error context:", fullContext);
        console.error("Problematic message: ", responseCapture.content);
        callback(e, null);
      }
    })
    .catch(err => {
      console.log("extendConversation response error in", responseCapture.content, "\n\nError:", err);
      callback(err, null);
    });
  }

}

module.exports = ConversationExtender;
