const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

const expressApp = express();
const PORT = process.env.PORT || 1337;

expressApp.use(express.json());

const allowedOrigins = ['https://admin.re4billion.ai', 'http://localhost:3000'];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests without an origin
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`Blocked by CORS: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200 // For legacy browser support
};

// Apply CORS middleware before routes
expressApp.use(cors(corsOptions));
expressApp.options('*', cors(corsOptions)); // Handle preflight requests

// Debugging log for request origins
expressApp.use((req, res, next) => {
    console.log(`Request Origin: ${req.get('Origin')}`);
    next();
});

// Define routes
expressApp.use('/', require('./routes/userRoutes')); 
expressApp.use('/admin', require('./routes/dataRoutes'));

// Error handling middleware
expressApp.use(errorHandler);

// Start server
expressApp.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});