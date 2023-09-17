// ScoreCalculator.js
// NOTE: this tests facilitates testing for the frontend algorithm. (TODO: use modules there)
class ScoreCalculator {
    constructor(linesLengths) {
      this.linesLengths = linesLengths;
      this.scores = new Array(linesLengths.length).fill(0);
      this.PERFECT_SCORE = 15;
      this.OVERESTIMATE_MULTIPLIER = 2;
      this.UNDERESTIMATE_MULTIPLIER = 4;
    }
  
    // Setter method to update scores directly if needed
    setScoreValues(scores) {
      if (scores.length !== this.linesLengths.length) {
        throw new Error("Scores array length doesn't match linesLengths array length");
      }
      this.scores = scores;
    }
  
    // This method returns a even score for over- and odd for under-estimates.
    updateScoresForIndex(index, selection) {
      if (index < 0 || index >= this.scores.length) {
        throw new Error("Index out of range");
      }
      
      const delta = this.linesLengths[index] - selection;
      const deltaMul = delta * ((delta < 0) ? this.OVERESTIMATE_MULTIPLIER : this.UNDERESTIMATE_MULTIPLIER);
      let score = this.PERFECT_SCORE - Math.abs(deltaMul);
      if (delta < 0) {
        score = score + 1;
      }
      this.scores[index] = score;
  
      return this.scores;
    }
  
    // Original method from the React class
    getTotalScore() {
      return this.scores.reduce((acc, curr) => acc + curr, 0);
    }
  }
  
  module.exports = ScoreCalculator;
  