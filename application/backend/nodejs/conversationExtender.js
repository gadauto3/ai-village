const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const OpenAI = require("openai");

const ssm = new AWS.SSM();
// Read and clean up the prompt text
const systemPromptTextFromFile = fs.readFileSync(path.join(__dirname, 'system-prompt.txt'), 'utf8').trim().replace(/\s+/g, ' ');
const userPromptTextFromFile = fs.readFileSync(path.join(__dirname, 'user-prompt.txt'), 'utf8').trim().replace(/\s+/g, ' ');

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

  async extendConversation(context, callback) {

    if (!this.isInitialized) {
      let timeout = 5000;
      await new Promise(resolve => setTimeout(resolve, timeout)); // wait for 5s
    }

    const fullContext = this.adjustPrompt(userPromptTextFromFile, context); // Use the cleaned-up prompt
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
        const message = response.choices[0].message;
        let responseJson = JSON.parse(message.content);

        callback(null, responseJson.lines);
      } catch (e) {
        callback(e, null);
      }
    })
    .catch(err => {
      callback(err, null);
    });
  }
}

module.exports = ConversationExtender;
