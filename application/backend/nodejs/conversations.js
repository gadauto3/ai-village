const fs = require('fs');
const path = require('path');
const seedrandom = require('seedrandom');
const ConversationAdapter = require('./conversationAdapter');

class Conversations {
    constructor() {
        this.data = this._loadData();
    }

    _loadData() {
        try {
            const rawData = fs.readFileSync(path.join(__dirname, 'conversationSeeds.json'), 'utf-8');
            const parsedJson = JSON.parse(rawData);
            const transformedData = ConversationAdapter.adaptConversation(parsedJson);
            return transformedData;
        } catch (error) {
            console.error("Error loading the conversations data", error);
            return [];
        }
    }

    getConversations(count, randomSeed="Gdawggggg") {
        let convos = [...this.data];
        count = Math.max(count, 2); // Less than 2 is not fun and doesn't count as a game
        let randGenerator = seedrandom(randomSeed);

        // Shuffle the convos array using the Fisher-Yates (aka Knuth) shuffle algorithm
        for (let i = convos.length - 1; i > 0; i--) {
            const j = Math.floor(randGenerator() * (i + 1));
            [convos[i], convos[j]] = [convos[j], convos[i]];
        }
        convos = convos.slice(0, count); // Now get the ones we need

        // If the count is more than available data, return all data.
        return convos;
    }
}

module.exports = Conversations;
