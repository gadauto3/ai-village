const Conversations = require('../conversations');
const fs = require('fs');

// Mocking the fs module
jest.mock('fs');

describe('Conversations', () => {
    let conversations;

    beforeAll(() => {
        // Mocked data to simulate the contents of 'data.json'
        const mockData = JSON.stringify([
            { color: "#123456", people: [], lines: [] },
            { color: "#789012", people: [], lines: [] },
            { color: "#345678", people: [], lines: [] }
        ]);

        fs.readFileSync.mockReturnValue(mockData);
        conversations = new Conversations();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return the expected number of conversations', () => {
        const result = conversations.getConversations(2);
        expect(result.length).toBe(2);
    });

    it('should return all conversations if count is more than available data', () => {
        const result = conversations.getConversations(10);
        expect(result.length).toBe(3);
    });

    it('should return the minimum if count is 0 or negative', () => {
        const negativeResult = conversations.getConversations(-5);
        const zeroResult = conversations.getConversations(0);
        const oneResult = conversations.getConversations(0);

        expect(negativeResult.length).toBe(2);
        expect(zeroResult.length).toBe(2);
        expect(oneResult.length).toBe(2);
    });
});
