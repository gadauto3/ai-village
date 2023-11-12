const fs = require('fs');
const Conversations = require('../conversations');

describe('Conversations - Tests using the seeds file', () => {

    let NUM_CONVOS = 4;

    it(`ensures conversationSeeds.json is valid JSON and contains an array of ${NUM_CONVOS} elements`, () => {
        // The actual readFileSync call without mocking
        const rawData = fs.readFileSync('./conversationSeeds.json', 'utf-8');

        // Validate it's a valid JSON
        let jsonData;
        expect(() => {
            jsonData = JSON.parse(rawData);
        }).not.toThrow();

        // Ensure it's an array and has a length of 5
        expect(Array.isArray(jsonData)).toBe(true);
        expect(jsonData.length).toEqual(NUM_CONVOS);
    });

    let conversations;
    let jsonData;

    beforeAll(() => {
        conversations = new Conversations();
        // Read and parse the JSON file once for all tests in this block
        const rawData = fs.readFileSync('./conversationSeeds.json', 'utf-8');
        jsonData = JSON.parse(rawData);
    });

    it('ensures that the people array has between one and five elements', () => {
        jsonData.forEach(convo => {
            expect(convo.people.length).toBeGreaterThanOrEqual(1);
            expect(convo.people.length).toBeLessThanOrEqual(NUM_CONVOS);
        });
    });

    it('ensures every line element has a name that is in the people array and text that has more than two words', () => {
        jsonData.forEach(convo => {
            const personNames = convo.people.map(person => person.name);
            convo.lines.forEach(line => {
                console.log("Line: "+line.text);
                expect(line).toHaveProperty('name');
                expect(personNames).toContain(line.name);
                
                expect(line).toHaveProperty('text');
                const wordCount = line.text.split(' ').length;
                if (wordCount == 2) console.log(line);
                expect(wordCount).toBeGreaterThanOrEqual(1);
            });
        });
    });

    it('ensures the conversations array returned has a length equal to the count parameter', () => {
        const count = 2;
        const coloredConvos = conversations.getConversations(count);

        expect(coloredConvos.length).toEqual(count);
    });

    it('ensures the conversations array returned has different order of elements with different seeds', () => {
        const count = jsonData.length;
        
        const coloredConvos1 = conversations.getConversations(count, "seed1");
        const coloredConvos2 = conversations.getConversations(count, "Seed2");

        expect(coloredConvos1[1]).not.toEqual(coloredConvos2[1]);
        expect(coloredConvos1[2]).not.toEqual(coloredConvos2[2]);
    });

    it('ensures the conversations array returned is the same when using the same seed', () => {
        const count = jsonData.length;
        
        const coloredConvos1 = conversations.getConversations(count, "sameSeed");
        const coloredConvos2 = conversations.getConversations(count, "sameSeed");
    
        expect(coloredConvos1).toEqual(coloredConvos2);
    });
});
