const feedbacksService = require("../services/feedbacks_service");
const {filterBuilder, regexpBuilder, dateRangeBuilder} = require("../../../../../utils/builders");
const {
    FEEDBACK_SEARCH_SCHEMA, FEEDBACK_BULK_DELETE_SCHEMA,
    FEEDBACK_CREATE_SCHEMA
} = require("../../../../../utils/helpers");
const {isEmpty} = require("lodash");
const isBoolean = require("validator/lib/isBoolean");
const {boolean} = require("boolean");
const {UserTypes} = require("../../../../../utils/enums");
const {DEFAULT_PAGINATION_PAGE, DEFAULT_PAGINATION_ITEMS} = require("../../../../../utils/constants");

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<*>}
 */
exports.getAllFeedbacks = async function (req, res) {
    try {
        let {page = DEFAULT_PAGINATION_PAGE, items = DEFAULT_PAGINATION_ITEMS} = req.query;
        let {user_role} = res.locals;

        if (user_role !== UserTypes.Admin) {
            return res
                .sendStatus(403);
        }

        let _query = await feedbacksService.findAllFeedbacks(null, null, {
            skip: (page - 1) * items,
            limit: items,
        });

        return res
            .status(200)
            .json(_query);
    } catch (e) {
        return res
            .sendStatus(500);
    }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<*|void>}
 */
exports.getFeedbackById = async function (req, res) {
    try {
        const {feedback_id} = req.params;
        let {user_id, user_role} = res.locals;

        let feedback = await feedbacksService.findFeedbackById(feedback_id);

        if (!feedback) {
            return res
                .status(404)
                .json({
                    message: `Feedback ID ${feedback_id} does not exist`
                });
        }

        if (user_role === UserTypes.User && (feedback['author']?.id !== user_id || !feedback['author'])) {
            return res
                .sendStatus(404);
        }

        return res
            .status(200)
            .json(feedback);
    } catch (e) {
        return res
            .sendStatus(500);
    }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<*|void>}
 */
exports.createFeedback = async function (req, res) {
    try {
        let {user_id} = res.locals;
        let feedback_data = FEEDBACK_CREATE_SCHEMA.validate(req.body, {
            allowUnknown: false, abortEarly: true,
        });

        if (feedback_data.error)
            return res
                .status(400)
                .json({
                    message: 'Malformed/Invalid request.',
                });

        await feedbacksService.createFeedback({author: user_id, ...feedback_data.value});

        return res.sendStatus(201);
    } catch (e) {
        return res
            .sendStatus(500);
    }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<*|void>}
 */
exports.deleteFeedbackById = async function (req, res) {
    try {
        let {hardDelete = "false"} = req.query;
        let {feedback_id} = req.params;

        if (!isBoolean(hardDelete))
            return res
                .status(400)
                .json({
                    message: "query 'hardDelete' must be a boolean value."
                });

        await feedbacksService.deleteFeedbackById(feedback_id, boolean(hardDelete));

        return res
            .sendStatus(204);
    } catch (e) {
        return res
            .sendStatus(500);
    }
}

exports.deleteManyFeedbacks = async function (req, res) {
    try {
        let {hardDelete = "false"} = req.query;

        let payload;

        if (!isBoolean(hardDelete))
            return res
                .status(400)
                .json({
                    message: "'hardDelete' must be a boolean value."
                });

        payload = FEEDBACK_BULK_DELETE_SCHEMA.validate(req.body, {
            allowUnknown: false, abortEarly: true,
        });

        if (payload.error)
            return res
                .status(400)
                .json({
                    message: payload.error.message,
                })

        await feedbacksService.bulkDeleteFeedbacks(payload.value.feedback_ids, boolean(hardDelete));

        return res
            .sendStatus(204)
    } catch (e) {
        return res
            .sendStatus(500);
    }
}