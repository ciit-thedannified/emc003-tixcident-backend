const {Router} = require('express');
const API_V1_USERS = require("./subroutes/users_route");
const API_V1_ISSUES = require("./subroutes/issues_route");
const API_V1_FEEDBACKS = require("./subroutes/feedbacks_route");
const API_V1_ISSUES_MESSAGES = require("./subroutes/issue_messages_route");

const API_V1_ROUTER = Router({
    strict: true,
    caseSensitive: true,
})

API_V1_ROUTER.use('/users', API_V1_USERS);
API_V1_ROUTER.use ('/issues/:issue_id/messages', API_V1_ISSUES_MESSAGES);
API_V1_ROUTER.use('/issues', API_V1_ISSUES);
API_V1_ROUTER.use('/feedbacks', API_V1_FEEDBACKS);

module.exports = API_V1_ROUTER;