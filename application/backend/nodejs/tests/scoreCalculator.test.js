const ScoreCalculator = require('../scoreCalculator');

test('ScoreCalculator class should initialize with correct default values', () => {
  const linesLengths = [5, 10, 15];
  const calculator = new ScoreCalculator(linesLengths);

  expect(calculator.linesLengths).toEqual(linesLengths);
  expect(calculator.scores).toEqual([0, 0, 0]);
  expect(calculator.PERFECT_SCORE).toBe(15);
});

test('setScoreValues should update scores correctly', () => {
  const linesLengths = [5, 10, 15];
  const calculator = new ScoreCalculator(linesLengths);

  calculator.setScoreValues([1, 2, 3]);
  expect(calculator.scores).toEqual([1, 2, 3]);
});

test('setScoreValues should throw error for mismatched array length', () => {
  const linesLengths = [5, 10, 15];
  const calculator = new ScoreCalculator(linesLengths);

  expect(() => {
    calculator.setScoreValues([1, 2]);
  }).toThrow("Scores array length doesn't match linesLengths array length");
});

test('updateScoresForIndex should correctly update scores based on selection', () => {
  const linesLengths = [5, 10, 15];
  const calculator = new ScoreCalculator(linesLengths);

  expect(calculator.updateScoresForIndex(1, 12)).toEqual([0, 12, 0]);
});

test('updateScoresForIndex should throw error for index out of range', () => {
  const linesLengths = [5, 10, 15];
  const calculator = new ScoreCalculator(linesLengths);

  expect(() => {
    calculator.updateScoresForIndex(3, 12);
  }).toThrow("Index out of range");
});

test('getTotalScore should correctly calculate the total score', () => {
  const linesLengths = [5, 10, 15];
  const calculator = new ScoreCalculator(linesLengths);

  calculator.setScoreValues([5, 10, 15]);
  expect(calculator.getTotalScore()).toBe(30);
});

test('updateScoresForIndex should correctly update scores based on selection battery', () => {
  const linesLengths = [5, 10, 15];
  const calculator = new ScoreCalculator(linesLengths);

  expect(calculator.updateScoresForIndex(1, 15)[1]).toEqual( 6);
  expect(calculator.updateScoresForIndex(1, 12)[1]).toEqual(12);
  expect(calculator.updateScoresForIndex(1, 11)[1]).toEqual(14);
  expect(calculator.updateScoresForIndex(1, 10)[1]).toEqual(15);
  expect(calculator.updateScoresForIndex(1,  9)[1]).toEqual(11);
  expect(calculator.updateScoresForIndex(1,  8)[1]).toEqual( 7);
  expect(calculator.updateScoresForIndex(1,  6)[1]).toEqual(-1);
});
