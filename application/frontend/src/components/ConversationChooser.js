import React, { useState } from 'react';
import { iconsPath } from "./utils";

import "../css/ConversationChooser.css";
import "../css/utils.css";

const ConversationChooser = ({ conversations, selectedConversation, setSelectedConversation }) => {
  const [areConversationsSet, setAreConversationsSet] = useState(false);
  const [preInitConvos, setPreInitConvos] = useState(["Conversation 1"]);

  
    return (
    <div className="conversation-chooser">
    {areConversationsSet && conversations.map((conversation, index) => (
        <div 
            key={index}
            className={`conversation-item ${conversation === selectedConversation ? 'selected' : ''}`}
            onClick={() => setSelectedConversation(conversation)}
        >
            <div className="image-container">
                <img src={`${iconsPath}/${conversation.people[0].icon}`} alt="Bottom Image" className="bottom-image"/>
                <img src={`${iconsPath}/${conversation.people[1].icon}`} alt="Top Image" className="top-image"/>
            </div>
            
            <div className="text-container">
                <span className={`conversation-item-names ${conversation === selectedConversation ? 'selected' : ''}`}>
                    {conversation.people.map(person => person.name).join(', ')}
                </span>
                <span className={`conversation-item-preview ${conversation === selectedConversation ? 'selected' : ''}`}>
                    {conversation.people[0].currentLine.split(' ').slice(0, 4).join(' ')}...
                </span>
            </div>
        </div>
    ))}

    {!areConversationsSet && preInitConvos.map((preConvo, index) => (
        <div 
            key={index}
            className="conversation-item"
        > 
            <div className="text-container spacing">
                <span className="conversation-item-names">
                    {preConvo}
                </span>
            </div>
        </div>
    ))}

    
    <button className="add-conversation-button">Add conversation</button>
    <button className="start-button">Start</button>
</div>

  );
}


export default ConversationChooser;