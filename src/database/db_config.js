const {MongoClientOptions} = require('mongodb');
const {join} = require("node:path");
const {DEFAULT_MAX_TIME_MS} = require("../../utils/constants");

const MongoDbURI =
    // 'mongodb://localhost:27017'
    'mongodb+srv://tixcident-mongodb.xso8y.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=tixcident-mongodb';

const certificate_name = "X509-cert-2600313313642817983.pem";

const certificate = join(__dirname, `./certificates/${certificate_name}`);

/**
 * Preferred Mongoose/MongoDB Client configurations
 * @type {MongoClientOptions}
 * */
const MongoDbConfiguration = {
    tlsCertificateKeyFile: certificate,
    serverApi: "1",

    dbName: 'tixcident',

    // time-based options
    socketTimeoutMS: 5_000,
    connectTimeoutMS: 15_000,
    maxIdleTimeMS: 300_000,
    minHeartbeatFrequencyMS: 10_000,
    heartbeatFrequencyMS: 30_000,
    wtimeoutMS: DEFAULT_MAX_TIME_MS,

    // logging
    journal: true
};


module.exports = {MongoDbURI, MongoDbConfiguration};