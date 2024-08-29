const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const client = require('prom-client');

const app = express();
const port = 3000;

// Create a Registry to register metrics
const register = new client.Registry();

// Define and register your metrics
const loginAttemptsCounter = new client.Counter({
    name: 'auth_service_login_attempts_total',
    help: 'Total number of login attempts',
});
const successfulLoginsCounter = new client.Counter({
    name: 'auth_service_successful_logins_total',
    help: 'Total number of successful logins',
});

register.registerMetric(loginAttemptsCounter);
register.registerMetric(successfulLoginsCounter);

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Metrics endpoint (must be before any other routes)
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    } catch (ex) {
        console.error('Error generating metrics:', ex);
        res.status(500).end();
    }
});

// Login route
app.post('/login', (req, res) => {
    const { email, wheelchairID } = req.body;
    loginAttemptsCounter.inc();  // Increment the login attempts counter

    // Simple login logic for testing
    if (email === 'test@example.com' && wheelchairID === 'test123') {
        successfulLoginsCounter.inc();  // Increment the successful logins counter
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// 404 Handler
app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(port, () => {
    console.log(`Auth service running at http://localhost:${port}`);
});
