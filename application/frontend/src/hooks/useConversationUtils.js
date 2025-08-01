import { useCallback } from 'react';
import { iconsPath } from '../components/utils';

// Hook responsible for conversation utility functions like icon resolution
const useConversationUtils = ({ conversation, userName }) => {
  // Get icon path for a participant by name
  const getIconPath = useCallback((name) => {
    if (!conversation || !conversation.people) return '';
    
    const person = conversation.people.find((person) => person.name === name);
    if (person && person.icon) {
      return `${iconsPath}${person.icon}`;
    }
    return '';
  }, [conversation]);

  // Get the name of the person who is "fetching" (for loading states)
  const getFetchingName = useCallback(() => {
    if (!conversation || !conversation.lines || conversation.lines.length < 2) {
      return '';
    }
    
    let penultimateLine = conversation.lines[conversation.lines.length - 2];
    
    // If the second-to-last line is from the user, get the third-to-last
    if (penultimateLine.name === userName && conversation.lines.length >= 3) {
      penultimateLine = conversation.lines[conversation.lines.length - 3];
    }
    
    return penultimateLine.name || '';
  }, [conversation, userName]);

  // Get participant names as a formatted string
  const getParticipantNames = useCallback(() => {
    if (!conversation || !conversation.people) return '';
    
    return conversation.people.map((person) => person.name).join(', ');
  }, [conversation]);

  // Check if a person exists in the conversation
  const isParticipant = useCallback((name) => {
    if (!conversation || !conversation.people) return false;
    
    return conversation.people.some((person) => person.name === name);
  }, [conversation]);

  // Get participant by name
  const getParticipant = useCallback((name) => {
    if (!conversation || !conversation.people) return null;
    
    return conversation.people.find((person) => person.name === name) || null;
  }, [conversation]);

  return {
    getIconPath,
    getFetchingName,
    getParticipantNames,
    isParticipant,
    getParticipant,
  };
};

export default useConversationUtils;