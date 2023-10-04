import React from 'react';

function TargetVisualizer({ numberOfRings, fillAmount, useRed }) {
    const redColors = ['#FFFAE1', '#FFE0A5', '#FFC49E', '#FFA87D', '#FF8D5B', '#FF5A38', '#FF0000'];
    const greenColors = ['#0000FF', '#4B0082', '#9400D3', '#FF0000', '#FF7F00', '#FFFF00', '#00FF00'];
    const colors = useRed ? redColors : greenColors;

    // Ensure we don't exceed the number of colors available or the provided number of rings.
    const ringsToDisplay = Math.min(colors.length, numberOfRings);
    
    // Calculate how many rings to fill based on the fillAmount and
    // Ensure that we always have at least one ring filled
    const filledRings = fillAmount < 0 ? 1 : Math.round(fillAmount * ringsToDisplay);

    function getSelectedColors(colors, ringsToDisplay) {
        if (ringsToDisplay >= colors.length) {
            return colors;
        }
    
        const step = (colors.length - 1) / (ringsToDisplay - 1);
        let selectedColors = [];
    
        for (let i = 0; i < ringsToDisplay; i++) {
            selectedColors.push(colors[Math.round(i * step)]);
        }
    
        return selectedColors;
    }
    
    const selectedColors = getSelectedColors(colors, ringsToDisplay);

    return (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle
                cx="50"
                cy="50"
                r="49"  // just inside the edge of the viewBox
                stroke="black"
                strokeWidth="2"
                fill="none"
            />
            {selectedColors.map((color, i) => {
                const radius = 50 - (i * (100 / (2 * ringsToDisplay)));  // Adjusts spacing based on number of rings
                if (i < filledRings) {
                    return (
                        <circle
                            key={i}
                            cx="50"
                            cy="50"
                            r={radius}
                            fill={color}
                        />
                    );
                } else {
                    return (
                        <circle
                            key={i}
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="white"
                            stroke={color}
                            strokeWidth="2"
                        />
                    );
                }
            })}
        </svg>
    );    
}

export default TargetVisualizer;
