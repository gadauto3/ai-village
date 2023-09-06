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

  it("should throw an error if requested colors exceed available colors", () => {
    expect(() => rainbow.getColors(8)).toThrow("Requested number of colors exceeds available rainbow colors.");
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
