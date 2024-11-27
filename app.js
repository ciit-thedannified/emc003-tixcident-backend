const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const API_V1_ROUTER = require('./src/routes/api/v1/index.js');
const cors = require('cors');
const getConnection = require('./src/database/index.js');

// Main Express Application
let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

getConnection();

app.use('/api/v1', API_V1_ROUTER);

console.log(process.env.NODE_ENV);

module.exports = app;
