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
      if (entryLength <= entryLengthMin) {
        setError(`Please use more than ${entryLengthMin} characters.`);
        return;
      } else if (entryLength > entryLengthMax) {
        setError(`Please use less than ${entryLengthMax} characters.`);
        return;
      }

      const regex = /^[\p{L}0-9-. _]+$/u;
      if (!regex.test(entry)) {
        setError(`Please use only letters, numbers, .-_ and space characters.`);
        return;
      }
    }

    setError("");
    if (onClose) {
      onClose(inputValue.trim());
    }
    closeModal(inputValue.trim());
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
