require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

//Custom Middleware Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
})

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

//Middleware
app.use(express.urlencoded({ extended: false}));

//Build in middleware for JSON requests
app.use(express.json());

//Serve static files
app.use(express.static(path.join(__dirname, '/public')));

// Routes
//app.use('/', require('./views/index'));
app.use('/states', require('./routes/api/states'));
app.use('/states/:state', require('./routes/api/states'));

// Catch 404
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({"error": "404 Not Found"});
    } else {
        res.type('txt').send("404 Not Found");
    }
});

 mongoose.connection.once('open', () => {
     console.log('Connected to MongoDB');
     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 });
