import React, { useState } from 'react';
import "../css/UserTokens.css";
import "../css/utils.css";

import tokenImage from '../assets/images/token.png';

const UserTokens = ({ isEnabled, buttonPressed }) => {
    const [pressedTokens, setPressedTokens] = useState([false, false, false]);

    const handleButtonClick = (index) => {
        if (!isEnabled || pressedTokens[index]) return;
        const newPressedTokens = [...pressedTokens];
        newPressedTokens[index] = true;
        setPressedTokens(newPressedTokens);
        buttonPressed(index); // Notifying the parent about which button was pressed
    }

    return (
        <div className="user-tokens glowing-border">
            {pressedTokens.map((wasPressed, index) => (
                <button 
                  key={index}
                  disabled={wasPressed || !isEnabled}
                  onClick={() => handleButtonClick(index)}
                  className={`token-button ${wasPressed ? 'pressed' : ''}`}
                  style={{ backgroundImage: `url(${tokenImage})` }}
                />
            ))}
        </div>
    );
}

export default UserTokens;
