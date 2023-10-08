import React from 'react';
import "../css/Person.css";
import "../css/utils.css";

function Person({ color, updateLine, isClickable, isApiSuccess, isMuted, isColorFlipped, data }) {
    return (
        <div
            className="d-flex align-items-center mt-2 rounded-div"
            style={{ 
                backgroundColor: isColorFlipped ? "black" : color,
                border: isColorFlipped ? `1px solid ${color}` : "none",
                boxShadow: isColorFlipped ? `0 0 5px #00D9FF` : "none"
            }}
        >
            <button
                className="mr-2 wide-btn spacing rounded-btn"
                type="button"
                onClick={updateLine}
                disabled={(!isClickable && !isApiSuccess) || isMuted}
            >
                {data.name}
            </button>
            <img
                src={data.icon}
                alt="Icon"
                className="icon mr-2 spacing"
            />
            <div
                className="form-control spacing no-shadow"
                style={{ opacity: data.opacity, transition: data.opacity === 1 ? "none" : "opacity 5s ease-in-out" }}
            >
                {data.currentLine}
            </div>
        </div>
    );
}

export default Person;
