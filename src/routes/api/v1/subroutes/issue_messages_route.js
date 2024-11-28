/**
 * ROUTER URI: /api/v1/issues/:issue_id/messages
 *
 */

const {Router} = require('express');
const issueMessagesController = require('../controllers/issue_messages_controller');

const API_V1_ISSUES_MESSAGES = Router({
    strict: true, caseSensitive: true,
});

API_V1_ISSUES_MESSAGES.get('/', issueMessagesController.getAllIssueMessages)

API_V1_ISSUES_MESSAGES.get('/:message_id', issueMessagesController.getIssueMessageById);

API_V1_ISSUES_MESSAGES.post('/', issueMessagesController.createIssueMessage);

API_V1_ISSUES_MESSAGES.delete('/', issueMessagesController.deleteAllIssueMessages);

API_V1_ISSUES_MESSAGES.delete('/:message_id', issueMessagesController.deleteIssueMessageById);

module.exports = API_V1_ISSUES_MESSAGES;