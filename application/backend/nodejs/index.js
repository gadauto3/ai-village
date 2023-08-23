const serverless = require('serverless-http');
const express = require('express');
const Conversations = require('./conversations');
const ConversationExtender = require('./conversationExtender');

const app = express();
const conversations = new Conversations();
const conversationExtender = new ConversationExtender();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/api/getConversations', (req, res) => {
    const count = 3;//parseInt(req.query.count) || conversations.data.length; // Get count from query or return all
    const data = conversations.getConversations(count);
    res.send({ conversations: data });
});

// Modified addToConversation route
app.post('/api/addToConversation', (req, res) => {
    // Get data from request body
    // const data = req.body;
    console.log(req.body);

    // Logic for adding data to conversation
    const data = [
        {
            "name": "Maria",
            "text": "You can play it in a few days"
        },
        {
            "name": "Pablo",
            "text": "A few days.  Gimme now!"
        },
        {
            "name": "Maria",
            "text": "Gimme, gimme never gets. Don't you..."
        },
        {
            "name": "Pablo",
            "text": "know my manners yet. Good point."
        },
        {
            "name": "Maria",
            "text": "All good, I want it done too."
        },
        {
            "name": "Pablo",
            "text": "Can I help in any way?"
        }
    ];

    // For now, it just sends back the received data
    res.send({ moreLines: data });
});

// app.listen(3000, () => console.log(`Listening on: 3000`));
module.exports.handler = serverless(app);
