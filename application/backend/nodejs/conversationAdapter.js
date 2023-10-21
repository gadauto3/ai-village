class ConversationAdapter {
  static adaptConversation(parsedJson) {
    return parsedJson.map((conversation, index) => {
      return {
        aiGuess: null,
        currentLineIndex: 0,
        initialLength: conversation.lines.length,
        key: index + 1,
        people: [
          {
            name: conversation.people[0].name,
            icon: conversation.people[0].icon,
            currentLine: conversation.lines[0].text,
          },
          {
            name: conversation.people[1].name,
            icon: conversation.people[1].icon,
            currentLine: "",
          },
        ],
        lines: conversation.lines.map((line) => ({ ...line, message: null })),
      };
    });
  }

  static adaptLines(lines) {
    return lines.map((line) => {
      if (!line.message) {
        return { ...line, message: null };
      }
      return line;
    });
  }
}

module.exports = ConversationAdapter;
