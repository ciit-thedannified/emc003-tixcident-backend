const feedbacksService = require("../services/feedbacks_service");
const {filterBuilder, regexpBuilder, dateRangeBuilder} = require("../../../../../utils/builders");
const {
    FEEDBACK_SEARCH_SCHEMA, FEEDBACK_BULK_DELETE_SCHEMA,
    FEEDBACK_CREATE_SCHEMA
} = require("../../../../../utils/helpers");
const {isEmpty} = require("lodash");
const isBoolean = require("validator/lib/isBoolean");
const {boolean} = require("boolean");

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<*>}
 */
exports.getAllFeedbacks = async function (req, res) {
    try {
        let {page = 1, items = 10} = req.query;

        let filter = FEEDBACK_SEARCH_SCHEMA.validate(req.body);

        if (filter.error)
            return res
                .status(400)
                .json({
                    message: 'Malformed/Invalid request.'
                });


        let _filter = filter.value;

        let query = filterBuilder()
            .appendField("author", _filter?.author)
            .appendField("title", _filter?.title, (value) => value !== undefined ? regexpBuilder(new RegExp(`^${value}`, 'i')) : undefined)
            .appendField("type", _filter?.type)
            .appendField("rating", _filter?.rating)
            .appendField("createdAt", dateRangeBuilder(_filter?.fromDate, _filter?.toDate), value => !isEmpty(value) ? value : undefined)
            .build();

        let _query = await feedbacksService.findAllFeedbacks(query, null, {
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

        let feedback = await feedbacksService.findFeedbackById(feedback_id);

        if (!feedback) {
            return res
                .status(404)
                .json({
                    message: `Feedback ID ${feedback_id} does not exist`
                });
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
        let feedback_data = FEEDBACK_CREATE_SCHEMA.validate(req.body, {
            allowUnknown: false, abortEarly: true,
        });

        if (feedback_data.error)
            return res
                .status(400)
                .json({
                    message: 'Malformed/Invalid request.',
                });

        await feedbacksService.createFeedback(feedback_data.value);

        return res.sendStatus(201);
    } catch (e) {

        console.error(e);
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