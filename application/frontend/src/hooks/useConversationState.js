import { useCallback } from 'react';
import { deepCopy } from '../components/utils';

// Hook responsible for conversation state management operations
const useConversationState = ({ conversation, updateConversation }) => {
  // Safe wrapper for updating conversation
  const safeUpdateConversation = useCallback((updatedConversation) => {
    updateConversation(updatedConversation);
  }, [updateConversation]);

  // Update conversation lines with validation
  const updateConversationLines = useCallback((moreLines, currentConversation = null, validateLines) => {
    if (!conversation) return null;
    const updatedConversation = currentConversation ?? deepCopy(conversation);
    
    // Use validation function if provided
    if (validateLines && !validateLines(moreLines, updatedConversation)) {
      return currentConversation ?? conversation;
    }

    updatedConversation.lines.push(...moreLines);
    safeUpdateConversation(updatedConversation);
    return updatedConversation;
  }, [conversation, safeUpdateConversation]);

  // Increment the current line index
  const incrementIndex = useCallback((conversationCopy = null) => {
    if (!conversation) return null;
    const updatedConversation = conversationCopy ?? deepCopy(conversation);
    updatedConversation.currentLineIndex = updatedConversation.currentLineIndex + 1;
    safeUpdateConversation(updatedConversation);
    return updatedConversation;
  }, [conversation, safeUpdateConversation]);

  return {
    safeUpdateConversation,
    updateConversationLines,
    incrementIndex,
  };
};

export default useConversationState;