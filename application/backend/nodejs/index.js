const serverless = require('serverless-http');
const express = require('express');
const Conversations = require('./conversations');

const app = express();
const conversations = new Conversations();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/api/info', (req, res) => {
    const count = 2;//parseInt(req.query.count) || conversations.data.length; // Get count from query or return all
    const data = conversations.getConversations(count);
    res.send({ conversations: data });
});

// app.post('/api/v1/getback', (req, res) => {
//     res.send({ ...req.body });
// });

// app.listen(3000, () => console.log(`Listening on: 3000`));
module.exports.handler = serverless(app);
