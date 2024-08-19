const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

// Route to handle messages
app.post('/webhook', async (req, res) => {
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

        // Send Rasa's response back to the client
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send(error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Chatbot service is running on port ${PORT}`);
});
