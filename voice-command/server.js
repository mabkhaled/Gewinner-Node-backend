const express = require('express');
const bodyParser = require('body-parser');
const compareAudioRoute = require('./src/routes/compareAudioRoute');
const client = require('prom-client');

const app = express();
const port = 3001;

// Create a Registry to register metrics
const register = new client.Registry();

// Define a new Counter metric to track the number of requests
const requestsCounter = new client.Counter({
    name: 'voice_command_service_requests_total',
    help: 'Total number of requests to the voice command service'
});

// Define a new Counter metric to track the number of successful responses
const successCounter = new client.Counter({
    name: 'voice_command_service_success_total',
    help: 'Total number of successful responses from the voice command service'
});

// Define a new Counter metric to track the number of failed responses
const failureCounter = new client.Counter({
    name: 'voice_command_service_failure_total',
    help: 'Total number of failed responses from the voice command service'
});

// Register the metrics
register.registerMetric(requestsCounter);
register.registerMetric(successCounter);
register.registerMetric(failureCounter);

app.use(bodyParser.json());

// Middleware to log incoming requests and track metrics
app.use((req, res, next) => {
    // Increment the request counter
    requestsCounter.inc();
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

app.use('/compare_audio', compareAudioRoute);

// Metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
