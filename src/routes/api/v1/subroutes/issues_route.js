/*
 * ROUTER URI: /api/v1/issues
 *
 * For handling issue-related APIs
 */

const {Router} = require('express');
const issuesController = require("../controllers/issues_controller");
const {verifyToken, getUserRole, checkAdminRole} = require("../middlewares/md_authorization");

const API_V1_ISSUES = Router({
    strict: false, caseSensitive: true,
});

API_V1_ISSUES.use(verifyToken);
API_V1_ISSUES.use(getUserRole);

/**
 * Fetches all issue data in pagination format. (with filtering support)
 */
API_V1_ISSUES.get('/all', issuesController.getAllIssues);

/**
 * Fetches a specific issue document
 */
API_V1_ISSUES.get('/:issue_id', issuesController.getIssueById);

/**
 * Create a new issue
 */
API_V1_ISSUES.post("/", issuesController.createIssue);

/**
 * Update an existing issue
 */
API_V1_ISSUES.patch("/bulk", checkAdminRole, issuesController.updateManyIssues);

/**
 *
 */
API_V1_ISSUES.patch('/:issue_id', checkAdminRole, issuesController.updateIssueById);

/**
 *
 */
API_V1_ISSUES.delete('/bulk', checkAdminRole, issuesController.deleteManyIssues);

/**
 * Deletes an existing issue by marking them as 'deleted' (soft delete)
 */
API_V1_ISSUES.delete('/:issue_id', checkAdminRole, issuesController.deleteIssueById);

module.exports = API_V1_ISSUES;