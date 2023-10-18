const Conversations = require('../conversations');
const fs = require('fs');

// Mocking the fs module
jest.mock('fs');

describe('Conversations', () => {
    let conversations;

    beforeAll(() => {
        // Mocked data to simulate the contents of 'conversationSeeds.json'
        const mockData = JSON.stringify([
            {
                people: [
                    { name: "Person1A", icon: "icon1A.png" },
                    { name: "Person1B", icon: "icon1B.png" }
                ],
                lines: [
                    { name: "Person1A", text: "Hello 1A" },
                    { name: "Person1B", text: "Hi 1B" }
                ]
            },
            {
                people: [
                    { name: "Person2A", icon: "icon2A.png" },
                    { name: "Person2B", icon: "icon2B.png" }
                ],
                lines: [
                    { name: "Person2A", text: "Hello 2A" },
                    { name: "Person2B", text: "Hi 2B" }
                ]
            },
            {
                people: [
                    { name: "Person3A", icon: "icon3A.png" },
                    { name: "Person3B", icon: "icon3B.png" }
                ],
                lines: [
                    { name: "Person3A", text: "Hello 3A" },
                    { name: "Person3B", text: "Hi 3B" }
                ]
            }
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
