// Modal.js
import React, { useState } from 'react';
import '../css/ModalPopup.css';

const ModalPopup = ({ isVisible, textToDisplay, onClose, buttonText = "Dismiss", entryLength = -1 }) => {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');

    const handleDismiss = () => {
      if (entryLength !== -1) {
        const entry = inputValue.trim();
        if (entryLength !== -1 && entry.length > entryLength) {
          setError(`Please use less than ${entryLength} characters.`);
          return;
        }

        const regex = /^[a-zA-Z0-9-. _]+$/;
        if (!regex.test(entry)) {
          setError(`Please use only letters, numbers, .-_ and space characters.`);
          return;
        }
      }
      
      setError('');
      onClose(inputValue.trim());
    };

    return (
        isVisible ? (
            <div className="modal-overlay">
                <div className="modal">
                    <p>{textToDisplay}</p>
                    {entryLength !== -1 && (
                        <>
                            <input 
                                type="text" 
                                value={inputValue} 
                                onChange={e => setInputValue(e.target.value)}
                            />
                            {error && <p className="error">{error}</p>}
                        </>
                    )}
                    <button onClick={handleDismiss}>{buttonText}</button>
                </div>
            </div>
        ) : null
    );
};

export default ModalPopup;
