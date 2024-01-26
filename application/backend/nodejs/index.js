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
    const data = conversations.getConversations(count, req.query.seed);
    res.send({ conversations: data });
});

//https://d05czxd62e.execute-api.us-east-1.amazonaws.com/dev/api/addToConversation?numApiCalls=0
app.post('/api/addToConversation', (req, res) => {
    // Get data from request body
    const data = req.body;
    const act = parseInt(req.query.numApiCalls);

    conversationExtender.extendConversation(data, act, (err, response) => {
        if (err) {
            console.error("Conversation extension failed: ", err);
            res.send({ moreLines: [] });
            return;
        } else {
            res.send({ moreLines: response });
        }
    });
});

app.post('/api/addPlayerToConversation', (req, res) => {
    // Get data from request body
    const data = req.body;
    const act = parseInt(req.query.numApiCalls);

    conversationExtender.extendConversationWithUser(data, act, (err, response) => {
        if (err) {
            console.error("Conversation with user extension failed: ", err);
            res.send({ moreLines: [] });
            return;
        } else {
            res.send({ moreLines: response });
        }
    });
});

// app.listen(3000, () => console.log(`Listening on: 3000`));
module.exports.handler = serverless(app);
