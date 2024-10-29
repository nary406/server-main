const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

const expressApp = express();
const PORT = process.env.PORT || 1337;

// Define allowed origins for CORS
const allowedOrigins = ['http://admin.re4billion.ai', 'http://localhost:3000'];

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Allow the request
        } else {
            console.error(`Blocked by CORS: ${origin}`); // Log blocked origins
            callback(new Error('Not allowed by CORS')); // Block the request
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200, // For legacy browsers
};

// Apply CORS middleware globally
expressApp.use(cors(corsOptions));

// Handle routes
expressApp.use('/', require('./routes/userRoutes'));
expressApp.use('/admin', require('./routes/dataRoutes'));

// Use this middleware to respond to preflight requests
expressApp.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin); // Allow specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed methods
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
    res.header('Access-Control-Allow-Credentials', 'true'); // Allow credentials
    res.sendStatus(200); // Respond with 200 OK
});

// Error handler middleware
expressApp.use(errorHandler);

// Start server
expressApp.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
