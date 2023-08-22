const ConversationExtender = require('./conversationExtender');

describe('ConversationExtender', () => {
  let extender;

  beforeAll(() => {
    extender = new ConversationExtender();
  });

  test('extendConversation returns valid JSON', (done) => {
    console.log('before api call');
    extender.extendConversation("How do you create a branching dialogue?", (err, response) => {
      console.log('before api call', err);
      expect(err).toBe(null);

      // Check if the response is valid JSON
      try {
        const responseText = JSON.stringify(response);
        console.log("Response: ", responseText);
        JSON.parse(responseText);
        done();
      } catch (e) {
        done(e);
      }
    });
  }, 10000); // 10s wait
});
