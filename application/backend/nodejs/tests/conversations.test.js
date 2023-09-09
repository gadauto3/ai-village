const fs = require('fs');
const Conversations = require('../conversations');

describe('Conversations - Real File Tests', () => {

    it('ensures conversationSeeds.json is valid JSON and contains an array of five elements', () => {
        // The actual readFileSync call without mocking
        const rawData = fs.readFileSync('./conversationSeeds.json', 'utf-8');

        // Validate it's a valid JSON
        let jsonData;
        expect(() => {
            jsonData = JSON.parse(rawData);
        }).not.toThrow();

        // Ensure it's an array and has a length of 5
        expect(Array.isArray(jsonData)).toBe(true);
        expect(jsonData.length).toEqual(5);
    });

    let jsonData;

    beforeAll(() => {
        // Read and parse the JSON file once for all tests in this block
        const rawData = fs.readFileSync('./conversationSeeds.json', 'utf-8');
        jsonData = JSON.parse(rawData);
    });

    it('ensures that color is defined as an HTML-friendly number', () => {
        jsonData.forEach(convo => {
            expect(convo.color).toMatch(/^#[0-9a-fA-F]{6}$/);
        });
    });

    it('ensures that the people array has between one and five elements', () => {
        jsonData.forEach(convo => {
            expect(convo.people.length).toBeGreaterThanOrEqual(1);
            expect(convo.people.length).toBeLessThanOrEqual(5);
        });
    });

    it('ensures every line element has a name that is in the people array and text that has more than three words', () => {
        jsonData.forEach(convo => {
            const personNames = convo.people.map(person => person.name);
            convo.lines.forEach(line => {
                console.log("Line: "+line.text);
                expect(line).toHaveProperty('name');
                expect(personNames).toContain(line.name);
                
                expect(line).toHaveProperty('text');
                const wordCount = line.text.split(' ').length;
                if (wordCount == 3) console.log(line);
                expect(wordCount).toBeGreaterThan(3);
            });
        });
    });

});
