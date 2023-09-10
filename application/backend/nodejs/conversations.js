const fs = require('fs');
const path = require('path');
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

    getConversations(count) {
        const convos = this.data.slice(0, count);
        const colors = this.rainbowColors.getColors(count);
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
