const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const client = require('prom-client');

const app = express();
const PORT = process.env.PORT || 3002;

// Create a Registry to register metrics
const register = new client.Registry();

// Define a new Counter metric to track the number of requests
const requestsCounter = new client.Counter({
    name: 'chatbot_service_requests_total',
    help: 'Total number of requests to the chatbot service'
});

// Define a new Counter metric to track the number of successful responses from Rasa
const rasaSuccessCounter = new client.Counter({
    name: 'chatbot_service_rasa_success_total',
    help: 'Total number of successful responses from Rasa'
});

// Define a new Counter metric to track the number of failed responses from Rasa
const rasaFailureCounter = new client.Counter({
    name: 'chatbot_service_rasa_failure_total',
    help: 'Total number of failed responses from Rasa'
});

// Register the metrics
register.registerMetric(requestsCounter);
register.registerMetric(rasaSuccessCounter);
register.registerMetric(rasaFailureCounter);

app.use(bodyParser.json());

// Route to handle messages
app.post('/webhook', async (req, res) => {
    // Increment the request counter
    requestsCounter.inc();

    // Log the incoming request body
    console.log('Request body:', req.body);

    // Destructure the message field from the request body
    const { message } = req.body;

    // Log the message field specifically
    console.log('Extracted message:', message);

    // Check if message exists
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // Send message to Rasa
        const response = await axios.post('http://127.0.0.1:5005/webhooks/rest/webhook', {
            sender: 'test_user',
            message: message
        });

        // Log the response from Rasa
        console.log('Rasa response:', response.data);

        // Increment the success counter
        rasaSuccessCounter.inc();

        // Send Rasa's response back to the client
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);

        // Increment the failure counter
        rasaFailureCounter.inc();

        res.status(500).send(error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Chatbot service is running on port ${PORT}`);
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});
