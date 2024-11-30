/**
 * ROUTER URI: /api/v1/issues/:issue_id/messages
 *
 */

const {Router} = require('express');
const issueMessagesController = require('../controllers/issue_messages_controller');
const {verifyToken, getUserRole, checkIssueAuthor, checkAdminRole} = require("../middlewares/md_authorization");

const API_V1_ISSUES_MESSAGES = Router({
    strict: false, caseSensitive: true,
});

API_V1_ISSUES_MESSAGES.use(verifyToken);
API_V1_ISSUES_MESSAGES.use(getUserRole);
API_V1_ISSUES_MESSAGES.use(checkIssueAuthor);

API_V1_ISSUES_MESSAGES.get('/', issueMessagesController.getAllIssueMessages)

API_V1_ISSUES_MESSAGES.get('/:message_id', issueMessagesController.getIssueMessageById);

API_V1_ISSUES_MESSAGES.post('/', issueMessagesController.createIssueMessage);

API_V1_ISSUES_MESSAGES.delete('/', checkAdminRole, issueMessagesController.deleteAllIssueMessages);

API_V1_ISSUES_MESSAGES.delete('/:message_id', checkAdminRole, issueMessagesController.deleteIssueMessageById);

module.exports = API_V1_ISSUES_MESSAGES;