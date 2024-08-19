const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000; // Make sure this port matches the one you're using

app.use(cors());
app.use(bodyParser.json());

// Middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    console.log('Request Body:', req.body);
    next();
});

app.post('/login', (req, res) => {
    const { email, wheelchairID } = req.body;
    console.log('Login request received with:', req.body);
    // Replace this with your actual login logic
    if (email === 'test@example.com' && wheelchairID === 'test123') {
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.post('/register', (req, res) => {
    const { fullName, email, password, phoneNumber, wheelchairID } = req.body;
    console.log('Register request received with:', req.body);
    // Replace this with your actual registration logic
    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/reset-password', (req, res) => {
    const { email, password } = req.body;
    console.log('Reset password request received with:', req.body);
    // Replace this with your actual password reset logic
    res.status(200).json({ message: 'Password reset successful' });
});

app.put('/update-terms-assistant/:id', (req, res) => {
    const { id } = req.params;
    console.log('Update terms request received for ID:', id);
    // Replace this with your actual update terms logic
    res.status(200).json({ message: 'Terms updated successfully' });
});

app.use((req, res) => {
    console.log(`404 Error - ${req.method} ${req.url} - ${new Date().toISOString()}`);
    res.status(404).send('Not Found');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
