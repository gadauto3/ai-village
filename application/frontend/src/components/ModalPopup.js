// Modal.js
import React, { useState } from "react";
import PropTypes from 'prop-types';
import "../css/ModalPopup.css";
import "../css/utils.css";

const ModalPopup = ({ isVisible, closeModal, config }) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const { textToDisplay, buttonText, onClose, entryLengthMin, entryLengthMax } = config;

  const handleDismiss = () => {
    if (entryLengthMin > 0) {
      const entry = inputValue.trim();
      const entryLength = entry.length;
      console.log("entry", entry, "entryLength", entryLength);
      if (entryLength <= entryLengthMin) {
        setError(`Please use more than ${entryLengthMin} characters.`);
        return;
      } else if (entryLength > entryLengthMax) {
        setError(`Please use less than ${entryLengthMax} characters.`);
        return;
      }

      const regex = /^[a-zA-Z0-9-. _]+$/;
      if (!regex.test(entry)) {
        setError(`Please use only letters, numbers, .-_ and space characters.`);
        return;
      }
    }

    console.log("Modal done. Closing with ", inputValue.trim());
    setError("");
    onClose(inputValue.trim());
    closeModal();
  };

  return isVisible ? (
    <div className="modal-overlay">
      <div className="modal no-shadow">
        <p>{textToDisplay}</p>
        {entryLengthMin > 0 && (
          <>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            {error && <p className="error">{error}</p>}
          </>
        )}
        <button onClick={handleDismiss}>{buttonText}</button>
      </div>
    </div>
  ) : null;
};

ModalPopup.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  config: PropTypes.shape({
    textToDisplay: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    entryLengthMin: PropTypes.number,
    entryLengthMax: PropTypes.number
  }).isRequired
};

export default ModalPopup;
