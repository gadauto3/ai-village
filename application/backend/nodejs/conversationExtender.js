const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const OpenAI = require("openai");

const ssm = new AWS.SSM();
// Read and clean up the prompt text
const promptTextFromFile = fs.readFileSync(path.join(__dirname, 'prompt.txt'), 'utf8').trim().replace(/\s+/g, ' ');
// FOR TESTING: const contextFromFile = fs.readFileSync(path.join(__dirname, 'context.json'), 'utf8').trim().replace(/\s+/g, ' ');

class ConversationExtender {
  constructor() {
    if (process.env.OPENAI_API_KEY){
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    // Start trying to get the api key
    this.isInitialized = false;
    try {
      this.retrieveApiKey();
    } catch (error) {
      console.log("Failed retrieveAPIKey.");
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
  
  adjustPrompt(promptText, context) {

    // API needs better input, so specifying names of villagers
    const allNames = context.lines.map(line => line.name);
    const uniqueNames = [...new Set(allNames)];
    const villagerSentence = 
      "The name fields in the lines that you will return are " +
      uniqueNames.join(' and ') +
      ", and the conversation should continue between them, starting with" +
      uniqueNames[uniqueNames.length - 2] +
      ".\n===\n";

    return `${promptText} ${villagerSentence} ${JSON.stringify(context).trim()}`;
  }

  async extendConversation(context, callback) {

    if (!this.isInitialized) {
      let timeout = 5000;
      await new Promise(resolve => setTimeout(resolve, timeout)); // wait for 5s
    }

    const fullContext = this.adjustPrompt(promptTextFromFile, context); // Use the cleaned-up prompt
    console.log("Content: ", fullContext);
    this.openai.completions.create({
      model: "text-davinci-003",
      prompt: fullContext,
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    .then(response => {

      // Check if the response is valid JSON
      try {
        // Safely extract the text part
        const textResponse = response.choices && response.choices[0] && response.choices[0].text ? response.choices[0].text.trim() : [];
        console.log("Response: ", textResponse);

        // This regular expression looks for the outermost square brackets [] and extracts the content inside
        const match = textResponse.trim().match(/(\[.*\])/);

        let responseJson = [];
        if (match) {
          const jsonResponse = match[0];
          responseJson = JSON.parse(jsonResponse);
          console.log("valid response: ", response);
        } else {
          console.log("No valid JSON array found in the response.");
        }

        callback(null, responseJson);
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