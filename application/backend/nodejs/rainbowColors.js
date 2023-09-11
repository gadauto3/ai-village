class RainbowColors {
  static MAX_COLORS = 7;

  constructor() {
    this.colors = [ "#FFCCCC", "#FFDFCC", "#FFFFCC", "#DFFFD8", "#CCDDFF", "#D1CCFF", "#E8CCFF" ];
  }

  getColors(numColors, randGenerator = null) {

    const selectedColors = [];
    const rand0to1 = randGenerator ? randGenerator() : Math.random();
    // Initialize to a random number between 0 and the number of colors
    let index = Math.floor(rand0to1 * (this.colors.length - numColors));

    for (let i = 0; i < numColors; i++) {
      selectedColors.push(this.colors[index % RainbowColors.MAX_COLORS]);
      index = index + 1;
    }

    return selectedColors;
  }
}

module.exports = RainbowColors;
