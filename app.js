const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const API_V1_ROUTER = require('./src/routes/api/v1/index.js');
const cors = require('cors');
const getConnection = require('./src/database/index.js');
const {signInWithEmailAndPassword, onIdTokenChanged, signOut} = require('firebase/auth')
const {Authentication} = require("./src/firebase/firebase.config");
const bodyParser = require('body-parser');

// Main Express Application
let app = express();

const corsOptions = {
    origin: '*', // Allow all origins (you can restrict this to specific domains)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));

getConnection();

app.use('/api/v1', API_V1_ROUTER);

process.on('SIGINT', () => {
    console.log("okay");
})

module.exports = app;
