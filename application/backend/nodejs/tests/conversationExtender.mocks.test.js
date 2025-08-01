const OpenAI = require("openai");
const ConversationExtender = require('../conversationExtender');

// Mocking the OpenAI module
jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => {
    return {
      chat: {
        completions: {
          create: jest.fn(() => Promise.resolve({
            choices: [
              { 
                message: {
                  content: JSON.stringify({ 
                    lines: [
                      { name: 'Sivan', text: 'Mocked response 1' },
                      { name: 'Violet', text: 'Mocked response 2' },
                      { name: 'Sivan', text: 'Mocked response 3' }
                    ] 
                  })
                }
              }
            ]
          }))
        }
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
      expect(result).toEqual([
        {
          message: null,
          name: "Sivan",
          text: "Mocked response 1"
        },
        {
          message: null,
          name: "Violet",
          text: "Mocked response 2"
        },
        {
          message: null,
          name: "Sivan",
          text: "Mocked response 3"
        }
      ]);      
    };

    await instance.extendConversation(context, 1, callback);
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

    const promptText = "CURRENT_CONTEXT|CURRENT_USERS|>NEXT_USER";
    const actualOutput = instance.adjustPrompt(promptText, context);
    expect(actualOutput).toEqual(expect.stringContaining("Sivan and Violet"));
    expect(actualOutput).toEqual(expect.stringContaining("|>Violet"));

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

  it('should correctly remove matching elements from the new array', () => {
    const instance = new ConversationExtender();

    const priorArray = [
        { name: 'Sivan', text: '2. How are you, Violet?' },
        { name: 'Violet', text: "I'm doing great, thanks, Sivan! How about you?" },
    ];

    const newArray = [
        { name: 'Sivan', text: '2. How are you, Violet?' },
        { name: 'Violet', text: "I'm doing great, thanks, Sivan! How about you?" },
        { name: 'Sivan', text: 'Could be better, could be worse.' },
    ];

    const expectedResult = [
        { name: 'Sivan', text: 'Could be better, could be worse.' },
    ];

    const result = instance.removeMatchingElements(priorArray, newArray);
    expect(result).toEqual(expectedResult);
  });

  it("should correctly remove lines for those not in the prior lines.", () => {
    const instance = new ConversationExtender();

    const linesWithOtherPeople = [
      { name: "Preeta", text: "Can I tell you about an accidental discovery?" },
      { name: "Adisu", text: "Sure! Whatcha got Preeta?" },
      { name: "Gdawgg", text: "What am I doing here?" },
      { name: "Preeta", text: "Back in 1928, there was this English" },
      { name: "Adisu", text: "Ugh, sounds like one of those" },
      { name: "Dre", text: "Yo, yo, yo!" },
      { name: "Preeta", text: "Ha! But instead of " },
    ];

    const expectedLines = [
      { name: "Preeta", text: "Can I tell you about an accidental discovery?" },
      { name: "Adisu", text: "Sure! Whatcha got Preeta?" },
      { name: "Preeta", text: "Back in 1928, there was this English" },
      { name: "Adisu", text: "Ugh, sounds like one of those" },
      { name: "Preeta", text: "Ha! But instead of " },
    ];

    const result = instance.removeOthersFromLines(expectedLines, linesWithOtherPeople);
    expect(result).toEqual(expectedLines);
  });

  it("should return an error for extendConversation when act is greater than 3", async () => {
    const instance = new ConversationExtender();
    const context = { /* ... context setup ... */ };
    const act = 5; // Act greater than 3
    const callback = jest.fn();
  
    await instance.extendConversation(context, act, callback);
  
    expect(callback).toHaveBeenCalledWith("Acts above 3 are not currently supported.", null);
  });

  it("should return an error for extendConversationWithUser when act is greater than 3", async () => {
    const instance = new ConversationExtender();
    const context = { /* ... context setup ... */ };
    const act = 4; // Act greater than 3
    const callback = jest.fn();
  
    await instance.extendConversationWithUser(context, act, callback);
  
    expect(callback).toHaveBeenCalledWith("Acts above 3 are not currently supported.", null);
  });
  
});
