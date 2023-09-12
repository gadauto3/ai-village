const RainbowColors = require('../rainbowColors');

describe("RainbowColors", () => {
  
  let rainbow;
  
  beforeEach(() => {
    rainbow = new RainbowColors();
  });

  it("should return the correct number of colors", () => {
    const numColors = 3;
    const result = rainbow.getColors(numColors);
    console.log("colors: ", result);
    expect(result).toHaveLength(numColors);
  });
  
  it("should return the correct number of colors even when the request exceeds the available colors", () => {
    const numColors = 10; // increased to a number greater than 7 to test exceeding available colors
    const result = rainbow.getColors(numColors);

    // Check that the correct number of colors is returned
    expect(result).toHaveLength(numColors);

    // Check that there are repeating colors in the result
    const uniqueColors = new Set(result);
    expect(uniqueColors.size).toBeLessThan(numColors);
  });

  it("should return unique sets of colors on multiple calls", () => {
    // This test might be flaky because it's possible (but very unlikely) to get the same set of colors multiple times.
    const results = new Set();
    for (let i = 0; i < 100; i++) {
      results.add(rainbow.getColors(3).join(','));
    }
    expect(results.size).toBeGreaterThan(1);
  });

});
