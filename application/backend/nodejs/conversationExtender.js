const fs = require('fs');
const path = require('path');
const OpenAI = require("openai");

// Read and clean up the prompt text
const promptText = fs.readFileSync(path.join(__dirname, 'prompt.txt'), 'utf8').trim().replace(/\s+/g, ' ');
const contextFromFile = fs.readFileSync(path.join(__dirname, 'context.json'), 'utf8').trim().replace(/\s+/g, ' ');

class ConversationExtender {
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  extendConversation(context, callback) {
    console.log("Context: ", context);
    this.openai.completions.create({
      model: "text-davinci-003",
      prompt: `${promptText} ${contextFromFile}`,  // Use the cleaned-up prompt
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
        const match = textResponse.match(/(\[.*\])/);

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
