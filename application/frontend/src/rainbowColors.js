class RainbowColors {
    constructor() {
        // Defining the rainbow colors in order
        this.colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
    }

    getColors(numColors) {
        // Check if the requested number of colors exceeds the total number of rainbow colors
        if (numColors > this.colors.length) {
            throw new Error("Requested number of colors exceeds available rainbow colors.");
        }

        // Randomly decide the start index
        const startIndex = Math.floor(Math.random() * (this.colors.length - numColors + 1));

        // Extract the colors based on the start index
        const selectedColors = this.colors.slice(startIndex, startIndex + numColors);

        return selectedColors;
    }
}

// Usage Example
const rainbow = new RainbowColors();
console.log(rainbow.getColors(3));
