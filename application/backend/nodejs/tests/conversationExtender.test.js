const fs = require('fs');
const path = require('path');
const ConversationExtender = require('../conversationExtender');

describe('ConversationExtender', () => {
  let extender;

  beforeAll(() => {
    // If OPENAI_API_KEY is not defined, skip the test
    if (process.env.OPENAI_API_KEY) {
        extender = new ConversationExtender();
    }
  });

  test('extendConversation returns valid JSON', (done) => {
    if (!process.env.OPENAI_API_KEY) {
        console.warn("Skipping ConversationExtender tests since OPENAI_API_KEY is not defined");
        done();
        return;
    }

    const contextFromFile = fs.readFileSync(path.join(__dirname, 'test-context.json'), 'utf8').trim().replace(/\s+/g, ' ');
    const context = JSON.parse(contextFromFile);
    console.log('before api call');
    extender.extendConversation(context, (err, response) => {
      console.log('before api call', err, response);
      expect(err).toBe(null);

      // Check if the response is valid JSON
      try {
        // Safely extract the text part
        const responseJson = JSON.stringify(response);
        const responseObj = JSON.parse(responseJson);

        // Ensure the response has more than 3 elements
        expect(responseObj.length).toBeGreaterThan(2);

        // Ensure each element is an object with 'name' and 'text' properties
        responseObj.forEach(line => {
            expect(line).toHaveProperty('name');
            expect(line).toHaveProperty('text');
        });

        done();
      } catch (e) {
        done(e);
      }
    });
  }, 12000); // 12s wait
});
