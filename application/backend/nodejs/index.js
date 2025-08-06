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
    const { context, action } = req.body;
    const act = parseInt(req.query.numApiCalls);
    const startTime = Date.now();

    // Validate context structure
    console.log("Received request body:", JSON.stringify(req.body, null, 2));
    
    if (!context) {
        console.error("Missing context in request body");
        res.status(400).send({ error: "Missing context in request body" });
        return;
    }

    // Ensure context has the expected structure for the backend
    const backendContext = {
        lines: context.conversation || context.lines || [],
        ...context
    };

    console.log("Processed backend context:", JSON.stringify(backendContext, null, 2));

    conversationExtender.extendConversation(backendContext, act, (err, updatedConversation) => {
        const duration = (Date.now() - startTime) / 1000;
        let newContext = { ...context, conversation: updatedConversation };

        // Add trace support
        if (!newContext.trace) newContext.trace = [];
        newContext.trace.push({
            agent: "backend",
            action: action,
            act: act,
            timestamp: new Date().toISOString()
        });

        // Add/update metadata
        if (!newContext.metadata) newContext.metadata = {};
        newContext.metadata.lastApiCallDuration = duration;
        newContext.metadata.lastAct = act;

        // Log context for CloudWatch
        console.log("MCP Context Response:", JSON.stringify(newContext));

        if (err) {
            console.error("Conversation extension failed: ", err);
            newContext.error = err;
            res.send({ context: newContext });
            return;
        } else {
            res.send({ context: newContext });
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
