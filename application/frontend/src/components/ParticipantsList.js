import React from 'react';

// Component responsible for rendering the conversation participants list
const ParticipantsList = ({ participants = [] }) => {
  if (!participants || participants.length === 0) {
    return null;
  }

  return (
    <div className="participants">
      <span className="to-label">To:</span>
      {participants.map((person, index) => (
        <span
          key={index}
          className={`participant ${index === 0 ? "first" : ""}`}
        >
          {person.name}
          {index < participants.length - 1 && ", "}
        </span>
      ))}
    </div>
  );
};

export default React.memo(ParticipantsList);