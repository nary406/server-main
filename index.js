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
            callback(null, true);
        } else {
            console.error(`Blocked by CORS: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
};

// Apply CORS middleware globally
expressApp.use(cors(corsOptions));

// Handle routes
expressApp.use('/', require('./routes/userRoutes'));
expressApp.use('/admin', require('./routes/dataRoutes'));

// Handle preflight requests for all routes
expressApp.options('*', cors(corsOptions));

// Error handler middleware
expressApp.use(errorHandler);

// Start server
expressApp.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
