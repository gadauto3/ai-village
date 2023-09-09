const OpenAI = require("openai");
const ConversationExtender = require('../conversationExtender');

// Mocking the OpenAI module
jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => {
    return {
      completions: {
        create: jest.fn(() => Promise.resolve({
          choices: [{ text: "[\"mocked response\"]" }]
        }))
      }
    };
  });
});

describe("ConversationExtender", () => {
  
  beforeEach(() => {
    // Mock the OPENAI_API_KEY env variable
    process.env.OPENAI_API_KEY = "mocked_api_key";
  });

  it("should extend conversation", async () => {
    const instance = new ConversationExtender();
    const context = {
      lines: [
          { name: 'Sivan', text: '2. How are you, Violet?' },
          { name: 'Violet', text: "I'm doing great, thanks, Sivan! How about you?" },
          { name: 'Sivan', text: 'Could be better, could be worse.' }
      ]
    };

    const callback = (error, result) => {
      expect(error).toBeNull();
      expect(result).toEqual(["mocked response"]);
    };

    await instance.extendConversation(context, callback);
  }, 6000); // 6s wait

  it('should adjust the prompt based on the provided context', () => {
    const instance = new ConversationExtender();
    const context = {
        lines: [
            { name: 'Sivan', text: '2. How are you, Violet?' },
            { name: 'Violet', text: "I'm doing great, thanks, Sivan! How about you?" },
            { name: 'Sivan', text: 'Could be better, could be worse.' }
        ]
    };

    const promptText = "CURRENT_CONTEXT|CURRENT_USERS|NEXT_USER";
    const actualOutput = instance.adjustPrompt(promptText, context);
    expect(actualOutput).toEqual(expect.stringContaining("Sivan and Violet"));

    // Expecting the output to contain the prompt text
    expect(actualOutput).toEqual(expect.stringContaining(JSON.stringify(context).trim()));
  });

  // Test with more names
  it('should adjust the prompt with multiple villagers', () => {
    const instance = new ConversationExtender();
      const context = {
          lines: [
              { name: 'Sivan', text: 'Hi Violet.' },
              { name: 'Violet', text: 'Hi An.' },
              { name: 'An', text: 'Hi Jerry.' },
              { name: 'Jerry', text: 'Hi Sivan.' }
          ]
      };

      const userPromptText = "CURRENT_CONTEXT|CURRENT_USERS|NEXT_USER";
      const expectedOutput = JSON.stringify(context).trim() + "|Sivan and Violet and An and Jerry|An";
      const actualOutput = instance.adjustPrompt(userPromptText, context);
      expect(actualOutput).toEqual(expectedOutput);
  });

});
