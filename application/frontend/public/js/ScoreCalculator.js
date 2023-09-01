"use strict";

// ScoreCalculator class

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ScoreCalculator = function () {
  function ScoreCalculator(linesLengths) {
    _classCallCheck(this, ScoreCalculator);

    this.linesLengths = linesLengths;
    this.scores = new Array(linesLengths.length).fill(0);
    this.PERFECT_SCORE = 15;
    this.OVERESTIMATE_MULTIPLIER = 2;
    this.UNDERESTIMATE_MULTIPLIER = 3;
  }

  // Setter method to update scores directly if needed


  _createClass(ScoreCalculator, [{
    key: "setScoreValues",
    value: function setScoreValues(scores) {
      if (scores.length !== this.linesLengths.length) {
        throw new Error("Scores array length doesn't match linesLengths array length");
      }
      this.scores = scores;
    }

    // This method will use the logic from the provided Node class

  }, {
    key: "updateScoresForIndex",
    value: function updateScoresForIndex(index, selection) {
      if (index < 0 || index >= this.scores.length) {
        throw new Error("Index out of range");
      }

      var delta = this.linesLengths[index] - selection;

      var deltaMul = delta * (delta < 0 ? this.OVERESTIMATE_MULTIPLIER : this.UNDERESTIMATE_MULTIPLIER);
      var score = this.PERFECT_SCORE - Math.abs(deltaMul);
      this.scores[index] = score;
      console.log("scores in getScoreForIndex", this.scores);

      return this.scores;
    }

    // Original method from the React class

  }, {
    key: "getTotalScore",
    value: function getTotalScore() {
      return this.scores.reduce(function (acc, curr) {
        return acc + curr;
      }, 0);
    }
  }]);

  return ScoreCalculator;
}();

export default ScoreCalculator;