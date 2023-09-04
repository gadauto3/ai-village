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
    const count = parseInt(req.query.numConvos); // Get convo count from query or return all
    const data = conversations.getConversations(count);
    res.send({ conversations: data });
});

// Modified addToConversation route
app.post('/api/addToConversation', (req, res) => {
    // Get data from request body
    const data = req.body;

    conversationExtender.extendConversation(data, (err, response) => {
        if (err) {
            console.error("Conversation extension failed: ", err);
            res.send({ moreLines: [] });
            return;
        } else {
            res.send({ moreLines: response });
        }
    });
});

// app.listen(3000, () => console.log(`Listening on: 3000`));
module.exports.handler = serverless(app);
