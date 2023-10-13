import React from 'react';

function TargetVisualizer({ numberOfRings, fillAmount, useRed }) {
    const redColors = ['#FFFAE1', '#FFE0A5', '#FFC49E', '#FFA87D', '#FF8D5B', '#FF5A38', '#FF0000'];
    const rainbowColors = ['#5CC93B', '#00000', '#5CC93B', '#00000', '#5CC93B', '#00000', '#87DD76', '#00000', '#D4F5CE', '#00000', '#F6CECC', '#00000', '#ED706A', '#00000', '#E93323'];
    const colors = useRed ? redColors : rainbowColors;

    const ringsToDisplay = Math.min(colors.length, numberOfRings);
    const filledRings = fillAmount < 0 ? 1 : Math.round(fillAmount * ringsToDisplay);

    function getSelectedColors(colors, ringsToDisplay) {
        return colors.slice(-ringsToDisplay);
    }

    const selectedColors = getSelectedColors(colors, ringsToDisplay);

    return (
        <svg viewBox="0 0 100 100" width="100px" height="100px">
            <circle
                cx="50"
                cy="50"
                r="49"
                stroke="black"
                strokeWidth="2"
                fill="none"
            />
            {selectedColors.map((color, i) => {
                const radius = 50 - (i * (100 / (2 * ringsToDisplay)));
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
                            r={radius-1}
                            fill={useRed?"white":"black"}
                            stroke="red"
                            strokeWidth={useRed?"2":"1"}
                        />
                    );
                }
            })}
        </svg>
    );
}

export default TargetVisualizer;
