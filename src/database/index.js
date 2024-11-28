const mongoose = require('mongoose');
const {MongoDbConfiguration, MongoDbURI} = require("./db_config.js");
const {UsersSchema} = require("./schemas/users_schema.js");
const {IssuesSchema} = require("./schemas/issues_schema.js");
const {FeedbacksSchema} = require("./schemas/feedbacks_schema");
const {IssueMessagesSchema} = require("./schemas/issue_messages_schema");

let MONGOOSE_DATABASE = null;

mongoose.connection.on('connected', ()=> {
    console.log('Pool connected');

    console.log(mongoose.connection.db.databaseName);
});

mongoose.connection.on('connecting', ()=> {
    console.log(`Connecting...`);
});

async function getConnection() {
    if (!MONGOOSE_DATABASE) {
        MONGOOSE_DATABASE = await mongoose.connect(MongoDbURI, MongoDbConfiguration);

        mongoose.model('users', UsersSchema);
        mongoose.model('issues', IssuesSchema);
        mongoose.model('feedbacks', FeedbacksSchema);
        mongoose.model('issue-messages', IssueMessagesSchema);
    }

    return MONGOOSE_DATABASE;
}

module.exports = getConnection;