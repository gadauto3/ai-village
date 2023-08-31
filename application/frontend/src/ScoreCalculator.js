"use strict";

// ScoreCalculator class
export default class ScoreCalculator {
  constructor(linesLengths) {
    this.linesLengths = linesLengths;
    this.scores = new Array(linesLengths.length).fill(0);
    this.PERFECT_SCORE = 15;
    this.OVERESTIMATE_MULTIPLIER = 2;
    this.UNDERESTIMATE_MULTIPLIER = 3;
  }

  // Setter method to update scores directly if needed
  setScoreValues(scores) {
    if (scores.length !== this.linesLengths.length) {
      throw new Error("Scores array length doesn't match linesLengths array length");
    }
    this.scores = scores;
  }

  // This method will use the logic from the provided Node class
  updateScoresForIndex(index, selection) {
    if (index < 0 || index >= this.scores.length) {
      throw new Error("Index out of range");
    }

    const delta = this.linesLengths[index] - selection;

    const deltaMul = delta * ((delta < 0) ? this.OVERESTIMATE_MULTIPLIER : this.UNDERESTIMATE_MULTIPLIER);
    const score = this.PERFECT_SCORE - Math.abs(deltaMul);
    this.scores[index] = score;
    console.log("scores in getScoreForIndex", this.scores);

    return this.scores;
  }

  // Original method from the React class
  getTotalScore() {
    return this.scores.reduce((acc, curr) => acc + curr, 0);
  }
}
