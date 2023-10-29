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
            const rawConvoSeeds = fs.readFileSync(path.join(__dirname, 'conversationSeeds.json'), 'utf-8');
            const parsedConvos = JSON.parse(rawConvoSeeds);

            const rawTutorialSeed = fs.readFileSync(path.join(__dirname, 'tutorialSeed.json'), 'utf-8');
            const parsedTutorial = JSON.parse(rawTutorialSeed);
            if (!Array.isArray(parsedTutorial)) { // Handle test issue
              parsedConvos.unshift(parsedTutorial);
            }

            const transformedData = ConversationAdapter.adaptConversation(parsedConvos);
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
        // Skip the first element since it's the tutorial
        for (let i = convos.length - 1; i > 1; i--) {
            const j = Math.floor(randGenerator() * i) + 1;
            [convos[i], convos[j]] = [convos[j], convos[i]];
        }
        convos = convos.slice(0, count); // Now get the ones we need

        // If the count is more than available data, return all data.
        return convos;
    }
}

module.exports = Conversations;
