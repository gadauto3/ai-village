import React from 'react';
import '../css/AnimatedCircles.css'; // Assuming you've saved the CSS in this file

function AnimatedCircles() {
    return (
      <div className="circle-container">
        <svg
          width="3rem"
          height="1rem"
          viewBox="0 0 3 1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle className="circle" cx="0.5" cy="0.5" r="0.38" />
          <circle className="circle" cx="1.5" cy="0.5" r="0.38" />
          <circle className="circle" cx="2.5" cy="0.5" r="0.38" />
        </svg>
      </div>
    );
}

export default AnimatedCircles;
