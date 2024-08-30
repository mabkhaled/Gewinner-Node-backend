const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { auth, requiresAuth } = require('express-openid-connect');
const mongoose = require('mongoose');
const authRoutes = require('./src/route/authRoutes');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Auth0 configuration
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_CLIENT_SECRET,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(auth(config));

// Routes
app.use('/auth', authRoutes);

// Profile route - only accessible when authenticated
app.get('/profile', requiresAuth(), (req, res) => {
    res.status(200).json({
        message: 'Login successful',
        user: req.oidc.user
    });
});

// 404 Handler
app.use((req, res) => {
    console.log('404 Not Found - URL:', req.originalUrl);
    res.status(404).send('Not Found');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Auth service running at http://localhost:${PORT}`);
});
