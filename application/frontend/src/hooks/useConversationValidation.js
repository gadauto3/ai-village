import { useCallback } from 'react';

// Hook responsible for conversation line validation logic
const useConversationValidation = () => {
  // Check if all names in the provided lines are participants of the conversation
  const areLinesForThisConversation = useCallback((lines, conversationToCheck) => {
    if (!conversationToCheck || !conversationToCheck.people) {
      return false;
    }
    
    const participantNames = conversationToCheck.people.map((person) => person.name);
    return lines.every((line) => participantNames.includes(line.name));
  }, []);

  // Validate conversation structure
  const isValidConversation = useCallback((conversation) => {
    if (!conversation) return false;
    if (!conversation.people || !Array.isArray(conversation.people)) return false;
    if (!conversation.lines || !Array.isArray(conversation.lines)) return false;
    return true;
  }, []);

  // Validate line structure
  const isValidLine = useCallback((line) => {
    if (!line || typeof line !== 'object') return false;
    if (!line.name || typeof line.name !== 'string') return false;
    return true;
  }, []);

  // Validate multiple lines
  const areValidLines = useCallback((lines) => {
    if (!Array.isArray(lines)) return false;
    return lines.every(isValidLine);
  }, [isValidLine]);

  return {
    areLinesForThisConversation,
    isValidConversation,
    isValidLine,
    areValidLines,
  };
};

export default useConversationValidation;