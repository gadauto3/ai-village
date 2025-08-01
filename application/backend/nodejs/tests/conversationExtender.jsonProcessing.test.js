const ConversationExtender = require('../conversationExtender');
const ConversationAdapter = require('../conversationAdapter');

// Mock OpenAI to avoid actual API calls during testing
jest.mock('openai');

describe('ConversationExtender JSON Processing (lines 215-247)', () => {
  let extender;
  let mockOpenAI;
  
  beforeEach(() => {
    // Mock OpenAI
    mockOpenAI = {
      chat: {
        completions: {
          create: jest.fn()
        }
      }
    };
    
    // Mock the OpenAI constructor
    const { OpenAI } = require('openai');
    OpenAI.mockImplementation(() => mockOpenAI);
    
    extender = new ConversationExtender();
    extender.isInitialized = true; // Skip initialization delay
  });

  const testOriginalLines = [
    { name: "Alice", text: "Hello there!" },
    { name: "Bob", text: "Hi Alice, how are you?" }
  ];

  describe('JSON Regex Matching and Parsing', () => {
    test('should handle valid JSON array in response', (done) => {
      const validJsonResponse = 'Here is your response: [{"name":"Alice","text":"Great to see you!"},{"name":"Bob","text":"Same here!"}]';
      
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: validJsonResponse } }]
      });

      extender.callOpenAI("test context", testOriginalLines, 1, (err, result) => {
        expect(err).toBeNull();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
        expect(result[0]).toHaveProperty('name', 'Alice');
        expect(result[0]).toHaveProperty('text', 'Great to see you!');
        done();
      });
    });

    test('should handle valid JSON object in response', (done) => {
      const validJsonResponse = 'Here is your response: {"lines":[{"name":"Alice","text":"Great to see you!"},{"name":"Bob","text":"Same here!"}]}';
      
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: validJsonResponse } }]
      });

      extender.callOpenAI("test context", testOriginalLines, 1, (err, result) => {
        expect(err).toBeNull();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
        done();
      });
    });

    test('should fail when no JSON is found in response', (done) => {
      const noJsonResponse = 'This is just plain text with no JSON at all.';
      
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: noJsonResponse } }]
      });

      extender.callOpenAI("test context", testOriginalLines, 1, (err, result) => {
        expect(err).toBeTruthy();
        expect(err.message).toContain('No valid JSON matched');
        expect(result).toBeNull();
        done();
      });
    });

    test('should fail when malformed JSON is found', (done) => {
      const malformedJsonResponse = 'Here is broken JSON: [{"name":"Alice","text":"Great to see you!",}]'; // trailing comma
      
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: malformedJsonResponse } }]
      });

      extender.callOpenAI("test context", testOriginalLines, 1, (err, result) => {
        expect(err).toBeTruthy();
        expect(result).toBeNull();
        done();
      });
    });

    test('should handle nested JSON structures correctly', (done) => {
      const nestedJsonResponse = 'Response: {"outer":{"lines":[{"name":"Alice","text":"Hello"}]}}';
      
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: nestedJsonResponse } }]
      });

      extender.callOpenAI("test context", testOriginalLines, 1, (err, result) => {
        // This should fail because the JSON doesn't have the expected structure
        expect(err).toBeTruthy();
        done();
      });
    });
  });

  describe('Response Processing Logic', () => {
    test('should remove matching elements from originalLines', (done) => {
      const responseWithDuplicates = `[
        {"name":"Alice","text":"Hello there!"},
        {"name":"Bob","text":"Hi Alice, how are you?"},
        {"name":"Alice","text":"I'm doing well!"}
      ]`;
      
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: responseWithDuplicates } }]
      });

      extender.callOpenAI("test context", testOriginalLines, 1, (err, result) => {
        expect(err).toBeNull();
        // Should only return the new line that wasn't in originalLines
        expect(result.length).toBe(1);
        expect(result[0].text).toBe("I'm doing well!");
        done();
      });
    });

    test('should filter out lines from unknown speakers', (done) => {
      const responseWithUnknownSpeaker = `[
        {"name":"Alice","text":"New message from Alice"},
        {"name":"Charlie","text":"Message from unknown person"},
        {"name":"Bob","text":"New message from Bob"}
      ]`;
      
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: responseWithUnknownSpeaker } }]
      });

      extender.callOpenAI("test context", testOriginalLines, 1, (err, result) => {
        expect(err).toBeNull();
        // Should filter out Charlie's message
        expect(result.length).toBe(2);
        expect(result.some(line => line.name === 'Charlie')).toBe(false);
        done();
      });
    });

    test('should handle empty lines array', (done) => {
      const emptyLinesResponse = '{"lines":[]}';
      
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: emptyLinesResponse } }]
      });

      extender.callOpenAI("test context", testOriginalLines, 1, (err, result) => {
        expect(err).toBeNull();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
        done();
      });
    });

    test('should handle missing lines property in JSON object', (done) => {
      const missingLinesResponse = '{"messages":[{"name":"Alice","text":"Hello"}]}'; // wrong property name
      
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: missingLinesResponse } }]
      });

      extender.callOpenAI("test context", testOriginalLines, 1, (err, result) => {
        // Should fail because responseJson.lines will be undefined
        expect(err).toBeTruthy();
        done();
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle OpenAI API errors', (done) => {
      mockOpenAI.chat.completions.create.mockRejectedValue(new Error('API Error'));

      extender.callOpenAI("test context", testOriginalLines, 1, (err, result) => {
        expect(err).toBeTruthy();
        expect(err.message).toBe('API Error');
        expect(result).toBeNull();
        done();
      });
    });

    test('should handle response without choices', (done) => {
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: []
      });

      extender.callOpenAI("test context", testOriginalLines, 1, (err, result) => {
        expect(err).toBeTruthy();
        expect(result).toBeNull();
        done();
      });
    });

    test('should handle response with null message', (done) => {
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: null }]
      });

      extender.callOpenAI("test context", testOriginalLines, 1, (err, result) => {
        expect(err).toBeTruthy();
        expect(result).toBeNull();
        done();
      });
    });
  });
});