const fs = require('fs');
const path = require('path');

class Conversations {
    constructor() {
        this.data = this._loadData();
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
        // If the count is more than available data, return all data.
        return this.data.slice(0, count);
    }
}

module.exports = Conversations;
