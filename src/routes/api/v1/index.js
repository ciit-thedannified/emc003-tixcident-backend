const {Router} = require('express');
const API_V1_USERS = require("./subroutes/users_route");
const API_V1_ISSUES = require("./subroutes/issues_route");
const API_V1_FEEDBACKS = require("./subroutes/feedbacks_route");
const API_V1_ISSUES_MESSAGES = require("./subroutes/issue_messages_route");

const API_V1_ROUTER = Router({
    strict: false,
    caseSensitive: true,
})

API_V1_ROUTER.use('/users', API_V1_USERS);
API_V1_ROUTER.use('/issues', API_V1_ISSUES);
API_V1_ROUTER.use ('/issue/:issue_id/messages', async (req, res, next) => {
    res.locals.issue_id = req.params.issue_id;
    next();
}, API_V1_ISSUES_MESSAGES);
API_V1_ROUTER.use('/feedbacks', API_V1_FEEDBACKS);

module.exports = API_V1_ROUTER;