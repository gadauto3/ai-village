import React from 'react';
import TargetVisualizer from './TargetVisualizer';
import "../css/utils.css";

function Scoreboard({ 
    conversations, 
    scores, 
    lastSelectedConversation, 
    totalScore, 
    handleScoreNotice, 
    scoreNoticeButtonTitle, 
    isApiSuccess 
}) {
    return (
        <div className="scoreboard rounded-div">
            <div className="scoreboard-content">
                <div className="scoreboard-left">
                    <h5>Scoreboard</h5>
                    <div className="conversation-row">
                        {conversations.map((conversation, index) => (
                            <div
                                key={index}
                                className="conversation-div"
                                style={{
                                    borderRadius: "6px",
                                    backgroundColor: conversation.color,
                                    border:
                                    index === lastSelectedConversation
                                        ? "2px solid #000"
                                        : "none", // conditionally apply border style
                                }}
                            >
                                {scores[index] || 0}
                            </div>
                        ))}
                    </div>
                    <div>
                        <button
                            className="btn btn-primary spacing"
                            disabled={lastSelectedConversation < 0}
                            onClick={() => handleScoreNotice(lastSelectedConversation)}
                        >
                            {scoreNoticeButtonTitle}
                        </button>
                        <h5>
                            Total Score: {totalScore} out of {conversations.length * 15}
                        </h5>
                    </div>
                </div>
                <div className={`scoreboard-right fade-in ${isApiSuccess ? "visible" : ""}`}>
                    {isApiSuccess && (
                        <TargetVisualizer numberOfRings={5} fillAmount={totalScore / (conversations.length * 15)} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Scoreboard;
