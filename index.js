const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

const expressApp = express();
const PORT = process.env.PORT || 1337;

expressApp.use(express.json());

const allowedOrigins = ['http://admin.re4billion.ai', 'http://localhost:3000'];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`Blocked by CORS: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials:true,
    optionsSuccessStatus: 200
};

expressApp.use(cors(corsOptions));





// Handle preflight OPTIONS requests across all routes
expressApp.options('*', (req, res) => {
    res.set({
        'Access-Control-Allow-Origin': allowedOrigins.includes(req.headers.origin) ? req.headers.origin : '',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
    });
    res.sendStatus(200);
});

// Manually add CORS headers for non-preflight requests in case Vercel omits them
expressApp.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(req.headers.origin) ? req.headers.origin : '');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});



expressApp.use('/', require('./routes/userRoutes')); 
expressApp.use('/admin', require('./routes/dataRoutes'));

expressApp.use(errorHandler);

expressApp.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});