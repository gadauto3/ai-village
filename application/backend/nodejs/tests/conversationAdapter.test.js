const ConversationAdapter = require('../conversationAdapter');

test('aiGuess, currentLineIndex, initialLength, and key should be set correctly', () => {
  const sampleConversation = [
    {
      "people": [{"name": "A", "icon": "iconA.png"}, {"name": "B", "icon": "iconB.png"}],
      "lines": [{"name": "A", "text": "Hello"}, {"name": "B", "text": "Hi"}]
    }
  ];
  
  const transformed = ConversationAdapter.adaptConversation(sampleConversation);
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
  
  const transformed = ConversationAdapter.adaptConversation(sampleConversation);
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
  
  const transformed = ConversationAdapter.adaptConversation(sampleConversation);
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
  
  const transformed = ConversationAdapter.adaptConversation(sampleConversations);

  expect(transformed.length).toBe(2);
  expect(transformed[1].key).toBe(2);
  expect(transformed[1].people[0].currentLine).toBe("Hey");
  expect(transformed[1].people[1].currentLine).toBe("");
});

test('adaptLines should add message property set to null for lines without it', () => {
  const sampleLines = [
    { name: "A", text: "Hello" },
    { name: "B", text: "Hi", message: "ExistingMessage" },
    { name: "C", text: "Hey" }
  ];
  
  const transformed = ConversationAdapter.adaptLines(sampleLines);

  expect(transformed[0].message).toBeNull();
  expect(transformed[1].message).toBe("ExistingMessage");
  expect(transformed[2].message).toBeNull();
});

test('adaptLines should not change other properties of lines', () => {
  const sampleLines = [
    { name: "A", text: "Hello" },
    { name: "B", text: "Hi" }
  ];
  
  const transformed = ConversationAdapter.adaptLines(sampleLines);

  expect(transformed[0].name).toBe("A");
  expect(transformed[0].text).toBe("Hello");
  expect(transformed[1].name).toBe("B");
  expect(transformed[1].text).toBe("Hi");
});
