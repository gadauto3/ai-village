class RainbowColors {
    constructor() {
      this.colors = {
        saturated: [
          "#FF0000", "#FF7F00", "#FFFF00", "#7FFF00", "#0000FF", "#4B0082", "#9400D3"
        ],
        muted: [
          "#FFCCCC", "#FFDFCC", "#FFFFCC", "#DFFFD8", "#CCDDFF", "#D1CCFF", "#E8CCFF"
        ]
      };
      this.startIndex = -1;
    }
  
    getColors(numColors, palette = "muted") {
      if (numColors > 7 || numColors < 1) {
        throw new Error("Requested number of colors exceeds available rainbow colors.");
      }
  
      const selectedColors = [];
      // Initialize to a random number between 0 and the number of colors
      let index = Math.floor(Math.random() * (this.colors[palette].length - numColors));

      // Calculate the start index such that index + numColors doesn't exceed 7
      this.startIndex = (this.startIndex + (7 - numColors)) % 7;
      
      do {
        for (let i = 0; i < numColors; i++) {
            selectedColors.push(this.colors[palette][index]);
            index = (index + 1);
        }
      } while (index == this.startIndex);
  
      this.startIndex = index;
      return selectedColors;
    }
  }
  
  module.exports = RainbowColors;
  