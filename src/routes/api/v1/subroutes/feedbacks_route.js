/*
 * ROUTER URI: /api/v1/issues
 *
 * For handling issue-related APIs
 */

const {Router} = require('express');
const feedbacksController = require('../controllers/feedbacks_controller');
const {verifyToken, getUserRole, checkAdminRole} = require("../middlewares/md_authorization");

const API_V1_FEEDBACKS = Router({
    strict: true,
    caseSensitive: true,
});

API_V1_FEEDBACKS.use(verifyToken);
API_V1_FEEDBACKS.use(getUserRole);

API_V1_FEEDBACKS.get('/all', feedbacksController.getAllFeedbacks);

API_V1_FEEDBACKS.get(`/:feedback_id`, feedbacksController.getFeedbackById);

API_V1_FEEDBACKS.post('/', feedbacksController.createFeedback);

API_V1_FEEDBACKS.delete('/bulk', checkAdminRole, feedbacksController.deleteManyFeedbacks);

API_V1_FEEDBACKS.delete('/:feedback_id', checkAdminRole, feedbacksController.deleteFeedbackById);

module.exports = API_V1_FEEDBACKS;