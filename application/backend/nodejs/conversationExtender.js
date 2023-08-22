const OpenAI = require("openai");

class ConversationExtender {
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  extendConversation(context, callback) {
    this.openai.completions.create({
      model: "text-davinci-003",
    //   prompt: `You are a playwright for a video game system. ${context}`,
      prompt: 'You are a playwright for a video game system. The game takes place in the village. You will be writing dialogues between people in the village. I will give you context for the conversation and you will respond by extending the dialogue between the two villagers. The format of the response is below. This will also be the format in which the game will provide context for dialogues:\n\n{\n        \"people\": [\n            {\n                \"name\": \"Maria\",\n                \"icon\": \"icons8-head-profile-50.png\",\n                \"currentLine\": \"Im Maria, hello!\"\n            },\n            {\n                \"name\": \"Pablo\",\n                \"icon\": \"icons8-head-profile-50.png\",\n                \"currentLine\": \"Cool, Im Pablo.  Welcome!\"\n            }\n        ],\n        \"context\": \"Maria and Pablo are friends that met in college. They see each other regularly.\",\n        \"lines\": [\n            {\n                \"name\": \"Maria\",\n                \"text\": \"2. How are you, Pablo?\"\n            },\n            {\n                \"name\": \"Pablo\",\n                \"text\": \"Im doing great, thanks, Maria! How about you?\"\n            },\n            {\n                \"name\": \"Maria\",\n                \"text\": \"Been trying to make a game\"\n            },\n            {\n                \"name\": \"Pablo\",\n                \"text\": \"Oh yeah, how goes the endeavor?\"\n            },\n            {\n                \"name\": \"Maria\",\n                \"text\": \"I am learning very much!\"\n            },\n            {\n                \"name\": \"Pablo\",\n                \"text\": \"When can I play it?\"\n            }\n        ],\n        \"currentLineIndex\": 0\n}\n\n===\n\nProvide the next 5-8 lines (formatted correctly) in the conversation for these people:\n\n{\n        \"color\": \"#2A9D8F\",\n        \"people\": [\n            {\n                \"name\": \"Sivan\",\n                \"icon\": \"icons8-head-profile-50.png\",\n                \"currentLine\": \"1: Hello from Sivan!\"\n            },\n            {\n                \"name\": \"Violet\",\n                \"icon\": \"icons8-head-profile-50.png\",\n                \"currentLine\": \"Greetings from Violet!\"\n            }\n        ],\n        \"context\": \"Sivan and Violet are co-workers, not on the same team, but theyve crossed paths.\",\n        \"lines\": [\n            {\n                \"name\": \"Sivan\",\n                \"text\": \"2. How are you, Violet?\"\n            },\n            {\n                \"name\": \"Violet\",\n                \"text\": \"Im doing great, thanks, Sivan! How about you?\"\n            },\n            {\n                \"name\": \"Sivan\",\n                \"text\": \"Could be better, could be worse.\"\n            }\n        ],\n        \"currentLineIndex\": 0\n    }"',
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    .then(response => {
      callback(null, response);
    })
    .catch(err => {
      callback(err, null);
    });
  }
}

module.exports = ConversationExtender;
