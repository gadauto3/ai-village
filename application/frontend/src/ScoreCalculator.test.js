import ScoreCalculator from './ScoreCalculator';

describe('ScoreCalculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new ScoreCalculator([3, 10, 2]); // for example
    });

    test('calculates perfect score for an index', () => {
        expect(calculator.updateScoresForIndex(0, 3)[0]).toBe(calculator.PERFECT_SCORE); // based on the logic provided
    });

    test('get perfect total score', () => {
        calculator.updateScoresForIndex(0, 3);
        calculator.updateScoresForIndex(1, 10);
        calculator.updateScoresForIndex(2, 2);
        expect(calculator.getTotalScore()).toBe(calculator.PERFECT_SCORE * 3);
    });

    // For the tests below, calculate the same distance from the answer but 
    //     underestimating gives a lower score (re: higher penalty)
    test('calculates underestimate score for an index', () => {
        const guess = 5;
        expect(calculator.updateScoresForIndex(1, guess)[1]).toBe(0);
        expect(calculator.updateScoresForIndex(1, guess)[1]).toBe(calculator.PERFECT_SCORE - (10 - guess) * calculator.UNDERESTIMATE_MULTIPLIER);
    });

    test('calculates overestimate score for an index', () => {
        const guess = 8;
        expect(calculator.updateScoresForIndex(0, guess)[0]).toBe(5);
        expect(calculator.updateScoresForIndex(0, guess)[0]).toBe(calculator.PERFECT_SCORE - (guess - 3) * calculator.OVERESTIMATE_MULTIPLIER);
    });

});
