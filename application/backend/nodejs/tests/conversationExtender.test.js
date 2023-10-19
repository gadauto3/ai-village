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

  test("extendConversation returns valid JSON", (done) => {
    if (!process.env.OPENAI_API_KEY) {
      console.warn("Skipping ConversationExtender tests since OPENAI_API_KEY is not defined");
      done();
      return;
    }

    const contextFromFile = fs
      .readFileSync(path.join(__dirname, "test-context.json"), "utf8")
      .trim()
      .replace(/\s+/g, " ");
    const context = JSON.parse(contextFromFile);
    console.log("before api call");
    extender.extendConversation(context, (err, response) => {
      console.log("before api call", err, response);
      expect(err).toBe(null);

      // Check if the response is valid JSON
      try {
        // Safely extract the text part
        const responseJson = JSON.stringify(response);
        const responseObj = JSON.parse(responseJson);

        // Ensure the response has more than 3 elements
        expect(responseObj.length).toBeGreaterThan(2);

        // Ensure each element is an object with 'name' and 'text' properties
        responseObj.forEach((line) => {
          expect(line).toHaveProperty("name");
          expect(line).toHaveProperty("text");
        });

        done();
      } catch (e) {
        done(e);
      }
    });
  }, 12000); // 12s wait

  test("extendConversationWithUser returns valid JSON", (done) => {
    if (!process.env.OPENAI_API_KEY) {
      console.warn("Skipping extendConversationWithUser tests since OPENAI_API_KEY is not defined");
      done();
      return;
    }

    const contextFromFile = fs
      .readFileSync(path.join(__dirname, "test-context.json"), "utf8")
      .trim()
      .replace(/\s+/g, " ");
    let context = JSON.parse(contextFromFile);
    const focalNoun = "dog";
    context.playerName = "testName";
    context.playerMessage = `I love ${focalNoun}s, can we discuss ${focalNoun}s?`;
    console.log("before api call for extendConversationWithUser");
    extender.extendConversationWithUser(context, (err, response) => {
      console.log("after api call for extendConversationWithUser", err, response);
      expect(err).toBe(null);

      // Check if the response is valid JSON
      try {
        const responseJson = JSON.stringify(response);
        const responseObj = JSON.parse(responseJson);

        // Ensure at least one line references the word "dog"
        const hasDogReference = responseObj.some(line => line.text.includes(focalNoun));
        expect(hasDogReference).toBe(true);

        // Ensure at least one line references the word "testName"
        const hasTestNameReference = responseObj.some(line => line.text.includes(context.playerName));
        expect(hasTestNameReference).toBe(true);

        // Ensure the response has more than 3 elements
        expect(responseObj.length).toBeGreaterThan(2);

        // Ensure each element is an object with 'name' and 'text' properties
        responseObj.forEach((line) => {
          expect(line).toHaveProperty("name");
          expect(line).toHaveProperty("text");
        });

        done();
      } catch (e) {
        done(e);
      }
    });
  }, 12000); // 12s wait
});
