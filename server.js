'use strict';

require('dotenv').config();

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const urlHandler = require('./controller/urlHandler.js');

const app = express();

mongoose.connect(process.env.MONGO_URI);

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl/new', urlHandler.addUrl);
app.get('/api/shorturl/:shortUrl', urlHandler.redirectWithShortUrl);

app.use((req, res) => { // req to unrouted path goes here
    res.status(404);
    res.type('txt')
        .send('Not Found');
});

app.listen(process.env.PORT, function() {
    console.log('Node.js listening...');
});

process.on('SIGINT', function() { // 'SIGINT' event is generated with ctrl+c from the terminal(not in terminal raw mode)
    mongoose.connection.close(function() {
        console.log("Mongoose default connection is closed due to application termination.");
        process.exit(0); // terminate process synchronously with a 'success' status (0)
    });
})

// It takes few minutes after closing connection to db for mongoose-sequence to initialize counter from 1.

