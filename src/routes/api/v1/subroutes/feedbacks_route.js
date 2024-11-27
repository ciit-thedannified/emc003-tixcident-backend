/*
 * ROUTER URI: /api/v1/issues
 *
 * For handling issue-related APIs
 */

const {Router} = require('express');
const {FeedbacksModel} = require("../../../../database/schemas/feedback_schema");

const API_V1_FEEDBACKS = Router({
    strict: true,
    caseSensitive: true,
});

API_V1_FEEDBACKS.get('/', async function (req, res) {
    const {page = 0, items = 100} = req.query;

});

API_V1_FEEDBACKS.get(`/:feedback_id`, async function (req, res) {
    try {
        const {feedback_id} = req.params;

        let query = await FeedbacksModel.findById(feedback_id, null, {
            maxTimeMS: 15_000,
        });

        if (!query) {
            return res
                .status(404)
                .json({
                    message: `Feedback ID ${feedback_id} does not exist`
                });
        }

        return res
            .status(200)
            .json(query);
    }
    catch (e) {
        return res
            .sendStatus(500);
    }
});

API_V1_FEEDBACKS.post('/', []);

module.exports = API_V1_FEEDBACKS;