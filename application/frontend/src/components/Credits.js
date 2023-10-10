
import React from "react";
import "../css/ModalPopup.css";
import "../css/Credits.css";

const Credits = ({ isVisible, closeModal }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal modal-overrides"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Credits</h2>
        <h5>Created and Engineered by</h5>
        <p>Gabriel Adauto</p>
        <h5 className="margin-override">Testing and Feedback</h5>
        <div className="credits-columns">
          <div>
            <p>
              Rosa Villegas<br />
              Coram Byrant<br />
              Maddie Nicolas<br />
              Jerry Fu
            </p>
          </div>
          <div>
            <p>
              Matt Barger<br />
              Nick<br />
              Jeremy
            </p>
          </div>
        </div>
        <h5>Creative and Technical Input</h5>
        <p>ChatGPT by OpenAI</p>
      </div>
    </div>
  );
};

export default Credits;
