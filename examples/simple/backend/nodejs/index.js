const serverless = require('serverless-http');
const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/api/info', (req, res) => {
    res.send({ conversations: conversations });
});

app.post('/api/v1/getback', (req, res) => {
    res.send({ ...req.body });
});

app.post('/api/friend/friendModel', (req, res) => {
    res.send({ ...req.body });
});

app.post('/api/friend/friendModel/_id*', (req, res) => {
    res.send({ ...req.body });
});

// app.listen(3000, () => console.log(`Listening on: 3000`));
module.exports.handler = serverless(app);

const conversations = [
    {
        "color": "#6b0dd9",
        "persons": [
            {
                "name": "Person A-1",
                "icon": "icons8-head-profile-50.png",
                "currentLine": "1: Hello from Person A-1!"
            },
            {
                "name": "Person B-1",
                "icon": "icons8-head-profile-50.png",
                "currentLine": "Greetings from Person B-1!"
            }
        ],
        "lines": [
            {
                "name": "Person A-1",
                "text": "2. How are you, Person B-1?",
                "sentiment": "neutral"
            },
            {
                "name": "Person B-1",
                "text": "I'm doing great, thanks, Person A-1! How about you?",
                "sentiment": "positive"
            }
        ],
        "currentLineIndex": 0
    },
    {
        "color": "#909d6f",
        "persons": [
            {
                "name": "Person A-2",
                "icon": "icons8-head-profile-50.png",
                "currentLine": "1: Hello from Person A-2!"
            },
            {
                "name": "Person B-2",
                "icon": "icons8-head-profile-50.png",
                "currentLine": "Greetings from Person B-2!"
            }
        ],
        "lines": [
            {
                "name": "Person A-2",
                "text": "2. How are you, Person B-2?",
                "sentiment": "neutral"
            },
            {
                "name": "Person B-2",
                "text": "I'm doing great, thanks, Person A-2! How about you?",
                "sentiment": "positive"
            }
        ],
        "currentLineIndex": 0
    },
    {
        "color": "#1b9193",
        "persons": [
            {
                "name": "Person A-3",
                "icon": "icons8-head-profile-50.png",
                "currentLine": "1: Hello from Person A-3!"
            },
            {
                "name": "Person B-3",
                "icon": "icons8-head-profile-50.png",
                "currentLine": "Greetings from Person B-3!"
            }
        ],
        "lines": [
            {
                "name": "Person A-3",
                "text": "2. How are you, Person B-3?",
                "sentiment": "neutral"
            },
            {
                "name": "Person B-3",
                "text": "I'm doing great, thanks, Person A-3! How about you?",
                "sentiment": "positive"
            }
        ],
        "currentLineIndex": 0
    }
];