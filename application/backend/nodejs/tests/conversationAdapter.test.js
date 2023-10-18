const ConversationAdapter = require('../conversationAdapter');

test('aiGuess, currentLineIndex, initialLength, and key should be set correctly', () => {
  const sampleConversation = [
    {
      "people": [{"name": "A", "icon": "iconA.png"}, {"name": "B", "icon": "iconB.png"}],
      "lines": [{"name": "A", "text": "Hello"}, {"name": "B", "text": "Hi"}]
    }
  ];
  
  const transformed = ConversationAdapter.transform(sampleConversation);
  const convo = transformed[0];

  expect(convo.aiGuess).toBeNull();
  expect(convo.currentLineIndex).toBe(0);
  expect(convo.initialLength).toBe(2);
  expect(convo.key).toBe(1);
});

test('people array should be updated with currentLine correctly', () => {
  const sampleConversation = [
    {
      "people": [{"name": "A", "icon": "iconA.png"}, {"name": "B", "icon": "iconB.png"}],
      "lines": [{"name": "A", "text": "Hello"}, {"name": "B", "text": "Hi"}]
    }
  ];
  
  const transformed = ConversationAdapter.transform(sampleConversation);
  const convo = transformed[0];

  expect(convo.people[0].currentLine).toBe("Hello");
  expect(convo.people[1].currentLine).toBe("");
});

test('Each object in lines array should have message property set to null', () => {
  const sampleConversation = [
    {
      "people": [{"name": "A", "icon": "iconA.png"}, {"name": "B", "icon": "iconB.png"}],
      "lines": [{"name": "A", "text": "Hello"}, {"name": "B", "text": "Hi"}]
    }
  ];
  
  const transformed = ConversationAdapter.transform(sampleConversation);
  const convo = transformed[0];

  convo.lines.forEach(line => {
    expect(line.message).toBeNull();
  });
});

test('Transformation should work on multiple conversations', () => {
  const sampleConversations = [
    {
      "people": [{"name": "A", "icon": "iconA.png"}, {"name": "B", "icon": "iconB.png"}],
      "lines": [{"name": "A", "text": "Hello"}, {"name": "B", "text": "Hi"}]
    },
    {
      "people": [{"name": "X", "icon": "iconX.png"}, {"name": "Y", "icon": "iconY.png"}],
      "lines": [{"name": "X", "text": "Hey"}, {"name": "Y", "text": "Hello"}]
    }
  ];
  
  const transformed = ConversationAdapter.transform(sampleConversations);

  expect(transformed.length).toBe(2);
  expect(transformed[1].key).toBe(2);
  expect(transformed[1].people[0].currentLine).toBe("Hey");
  expect(transformed[1].people[1].currentLine).toBe("");
});
