import { tipForEarlyGuess, tipForGoodGame, tipForWin } from "./longStrings";

// ScoreCalculator.js
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

  // This method returns an even score for over- and odd for under-estimates.
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

  feedbackForScore(score) {
    const didGuessEarly = Math.abs(score % 2) === 1;
    if (score == this.PERFECT_SCORE) {
      return tipForWin;
    } else if (didGuessEarly) {
      return tipForEarlyGuess;
    } else {
      return tipForGoodGame;
    }
  }

  feedbackForOverallScore(score, numConvos) {
    let recommendation = "need practice. Please read the tips."
    if (score > 13 * numConvos) {
      recommendation = "are amazing!"
    } else if (score > 10 * numConvos) {
      recommendation = "are on the right track!"
    } else if (score > 0 * numConvos) {
      recommendation = "should consider the tips."
    }
    return recommendation;
  }

  // Original method from the React class
  getTotalScore() {
    return this.scores.reduce((acc, curr) => acc + curr, 0);
  }
}

export default ScoreCalculator;
