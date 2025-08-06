// Mock AWS SDK to prevent async calls during testing
jest.mock('@aws-sdk/client-ssm', () => ({
  SSM: jest.fn().mockImplementation(() => ({
    getParameters: jest.fn().mockResolvedValue({
      Parameters: [{ Name: '/aivillage/apikeys/openai', Value: 'mock-api-key' }]
    })
  }))
}));

const ConversationExtender = require('../conversationExtender');
const ConversationAdapter = require('../conversationAdapter');

describe('ConversationExtender processOpenAIResponse', () => {
  let extender;
  
  beforeEach(() => {
    extender = new ConversationExtender();
    extender.isInitialized = true; // Skip initialization delay
  });

  const testOriginalLines = [
    { name: "Alice", text: "Hello there!" },
    { name: "Bob", text: "Hi Alice, how are you?" }
  ];

  describe('JSON Extraction and Parsing', () => {
    test('should extract and parse valid JSON array from response', () => {
      const mockResponse = {
        choices: [{
          message: {
            content: 'Here is your response: [{"name":"Alice","text":"Great to see you!"},{"name":"Bob","text":"Same here!"}]'
          }
        }]
      };

      const result = extender.processOpenAIResponse(mockResponse, testOriginalLines, 1, 2.5);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0]).toHaveProperty('name', 'Alice');
      expect(result[0]).toHaveProperty('text', 'Great to see you!');
    });

    test('should extract and parse valid JSON object from response', () => {
      const mockResponse = {
        choices: [{
          message: {
            content: 'Here is your response: {"lines":[{"name":"Alice","text":"Great to see you!"},{"name":"Bob","text":"Same here!"}]}'
          }
        }]
      };

      const result = extender.processOpenAIResponse(mockResponse, testOriginalLines, 1, 2.5);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });

    test('should throw error when no JSON is found in response', () => {
      const mockResponse = {
        choices: [{
          message: {
            content: 'This is just plain text with no JSON at all.'
          }
        }]
      };

      expect(() => {
        extender.processOpenAIResponse(mockResponse, testOriginalLines, 1, 2.5);
      }).toThrow('No valid JSON matched from the response.');
    });

    test('should throw error when malformed JSON is found', () => {
      const mockResponse = {
        choices: [{
          message: {
            content: 'Here is broken JSON: [{"name":"Alice","text":"Great to see you!",}]'
          }
        }]
      };

      expect(() => {
        extender.processOpenAIResponse(mockResponse, testOriginalLines, 1, 2.5);
      }).toThrow('Failed to parse JSON from response');
    });

    test('should throw error when response structure is invalid', () => {
      const mockResponse = {
        choices: []
      };

      expect(() => {
        extender.processOpenAIResponse(mockResponse, testOriginalLines, 1, 2.5);
      }).toThrow('Invalid response structure from OpenAI API');
    });

    test('should throw error when message content is empty', () => {
      const mockResponse = {
        choices: [{
          message: {
            content: null
          }
        }]
      };

      expect(() => {
        extender.processOpenAIResponse(mockResponse, testOriginalLines, 1, 2.5);
      }).toThrow('Empty response content from OpenAI API');
    });

    test('should throw error when JSON object lacks lines property', () => {
      const mockResponse = {
        choices: [{
          message: {
            content: '{"messages":[{"name":"Alice","text":"Hello"}]}'
          }
        }]
      };

      expect(() => {
        extender.processOpenAIResponse(mockResponse, testOriginalLines, 1, 2.5);
      }).toThrow('Response JSON does not contain a valid \'lines\' array');
    });
  });

  describe('Response Processing Logic', () => {
    test('should remove matching elements from originalLines', () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([
              { name: "Alice", text: "Hello there!" },      // duplicate - should be removed
              { name: "Bob", text: "Hi Alice, how are you?" }, // duplicate - should be removed
              { name: "Alice", text: "I'm doing well!" }    // new - should be kept
            ])
          }
        }]
      };

      const result = extender.processOpenAIResponse(mockResponse, testOriginalLines, 1, 2.5);
      
      expect(result.length).toBe(1);
      expect(result[0].text).toBe("I'm doing well!");
    });

    test('should filter out lines from unknown speakers', () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([
              { name: "Alice", text: "New message from Alice" },
              { name: "Charlie", text: "Message from unknown person" }, // should be filtered out
              { name: "Bob", text: "New message from Bob" }
            ])
          }
        }]
      };

      const result = extender.processOpenAIResponse(mockResponse, testOriginalLines, 1, 2.5);
      
      expect(result.length).toBe(2);
      expect(result.some(line => line.name === 'Charlie')).toBe(false);
      expect(result.some(line => line.name === 'Alice')).toBe(true);
      expect(result.some(line => line.name === 'Bob')).toBe(true);
    });

    test('should handle empty lines array', () => {
      const mockResponse = {
        choices: [{
          message: {
            content: '{"lines":[]}'
          }
        }]
      };

      const result = extender.processOpenAIResponse(mockResponse, testOriginalLines, 1, 2.5);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    test('should adapt lines using ConversationAdapter', () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([
              { name: "Alice", text: "New message" }
            ])
          }
        }]
      };

      const result = extender.processOpenAIResponse(mockResponse, testOriginalLines, 1, 2.5);
      
      // ConversationAdapter.adaptLines should add message: null property
      expect(result[0]).toHaveProperty('message', null);
    });
  });

  describe('Complex JSON scenarios', () => {
    test('should handle JSON with extra whitespace and formatting', () => {
      const mockResponse = {
        choices: [{
          message: {
            content: `Here's the response:
            [
              {
                "name": "Alice",
                "text": "Nicely formatted message"
              }
            ]`
          }
        }]
      };

      const result = extender.processOpenAIResponse(mockResponse, testOriginalLines, 1, 2.5);
      
      expect(result.length).toBe(1);
      expect(result[0].text).toBe("Nicely formatted message");
    });

    test('should handle multiple JSON blocks and pick the first one', () => {
      const mockResponse = {
        choices: [{
          message: {
            content: 'First JSON: [{"name":"Alice","text":"First"}] and some text after'
          }
        }]
      };

      const result = extender.processOpenAIResponse(mockResponse, testOriginalLines, 1, 2.5);
      
      expect(result.length).toBe(1);
      expect(result[0].text).toBe("First");
    });
  });
});