import React from 'react';
import "./utils.css";

function Scoreboard({ conversations }) {
    return (
        <div className="scoreboard mt-3">
            <h5>Scoreboard</h5>
            <div className="d-flex">
                {conversations.map((conversation, index) => (
                    <div key={index} className="mr-2">
                        <input
                            type="text"
                            readOnly
                            className="form-control"
                            value={conversation.currentLineIndex}
                            style={{ backgroundColor: conversation.color, color: "#000" }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Scoreboard;
