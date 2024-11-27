/*
 * ROUTER URI: /api/v1/issues
 *
 * For handling issue-related APIs
 */

const {Router} = require('express');
const issuesController = require("../controllers/issues_controller");

const API_V1_ISSUES = Router({
    strict: true, caseSensitive: true,
});

/**
 * Fetches all issue data in pagination format. (with filtering support)
 */
API_V1_ISSUES.get('/', issuesController.getAllIssues);

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
API_V1_ISSUES.patch("/bulk", issuesController.updateManyIssues);

/**
 *
 */
API_V1_ISSUES.patch('/:issue_id', issuesController.updateIssueById);

/**
 *
 */
API_V1_ISSUES.delete('/bulk', issuesController.deleteManyIssues);

/**
 * Deletes an existing issue by marking them as 'deleted' (soft delete)
 */
API_V1_ISSUES.delete('/:issue_id', issuesController.deleteIssueById);




module.exports = API_V1_ISSUES;