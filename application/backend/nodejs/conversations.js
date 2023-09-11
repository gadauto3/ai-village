const fs = require('fs');
const path = require('path');
const seedrandom = require('seedrandom');
const RainbowColors = require('./rainbowColors');

class Conversations {
    constructor() {
        this.data = this._loadData();
        this.rainbowColors = new RainbowColors();
    }

    _loadData() {
        try {
            const rawData = fs.readFileSync(path.join(__dirname, 'conversationSeeds.json'), 'utf-8');
            return JSON.parse(rawData);
        } catch (error) {
            console.error("Error loading the conversations data", error);
            return [];
        }
    }

    getConversations(count, randomSeed="Gdawgg") {
        let convos = [...this.data];
        let randGenerator = seedrandom(randomSeed);
        const colors = this.rainbowColors.getColors(count, randGenerator);

        randGenerator = seedrandom("Gdawgg");
        // Shuffle the convos array using the Fisher-Yates (aka Knuth) shuffle algorithm
        for (let i = convos.length - 1; i > 0; i--) {
            const j = Math.floor(randGenerator() * (i + 1));
            [convos[i], convos[j]] = [convos[j], convos[i]];
        }
        convos = convos.slice(0, count); // Now get the ones we need

        // Add the rainbow colors
        const coloredConvos = convos.map((item, index) => {
            if (colors[index] !== undefined) {
              item.color = colors[index];
            }
            return item;
          });

        // If the count is more than available data, return all data.
        return coloredConvos;
    }
}

module.exports = Conversations;
