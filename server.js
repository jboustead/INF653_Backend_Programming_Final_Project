require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

//Middleware
app.use(express.urlencoded({ extended: false}));

//Build in middleware for JSON requests
app.use(express.json());

//Serve static files
app.use(express.static(path.join(__dirname, '/public')));

// Routes
app.use('/states', require('./routes/api/states'));
app.use('/states/:state', require('./routes/api/states'));

// Serve the index.html file for valid URLs
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

// Serve the 404.html file for invalid URLs
app.all('*', (req, res) => {
    res.status(404);
    res.sendFile(path.join(__dirname, 'public', 'views', '404.html'));
});

// Catch 404
// app.all('*', (req, res) => {
//     res.status(404);
//     if (req.accepts('html')) {
//         res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
//     } else if (req.accepts('json')) {
//         res.json({"error": "404 Not Found"});
//     } else {
//         res.type('txt').send("404 Not Found");
//     }
// });

 mongoose.connection.once('open', () => {
     console.log('Connected to MongoDB');
     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 });
