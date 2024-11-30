const issueMessagesService = require('../services/issue_messages_service');
const {ISSUE_MESSAGE_CREATE_SCHEMA} = require("../../../../../utils/helpers");
const {DEFAULT_PAGINATION_PAGE, DEFAULT_PAGINATION_ITEMS} = require("../../../../../utils/constants");

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
exports.getAllIssueMessages = async function (req, res) {
    try {
        let issue_id = res.locals.issue_id;
        let {page = DEFAULT_PAGINATION_PAGE, items = DEFAULT_PAGINATION_ITEMS} = req.query;

        let _query = await issueMessagesService.findAllIssueMessages({
            issue_id: issue_id,
        }, null, {
            skip: (page - 1) * items,
            limit: items,
        });

        return res
            .status(200)
            .json(_query);
    }
    catch (e) {
        return res
            .sendStatus(500);
    }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
exports.getIssueMessageById = async function (req, res) {
    try {
        let issue_id = res.locals.issue_id;
        const {message_id} = req.params;

        let issue_message = await issueMessagesService.findIssueMessageById(issue_id, message_id);

        if (!issue_message)
            return res
                .status(404)
                .json({
                    message: `Issue Message ID '${message_id} does not exist.`,
                });

        return res
            .status(200)
            .json(issue_message);
    }
    catch (e) {
        return res
            .sendStatus(500);
    }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
exports.createIssueMessage = async function (req, res) {
    try {
        let issue_id = res.locals.issue_id;
        let message_data = ISSUE_MESSAGE_CREATE_SCHEMA.validate(req.body);

        if (message_data.error)
            return res
                .status(400)
                .json({
                    message: 'Malformed/Invalid request.'
                });

        await issueMessagesService.createIssueMessage(issue_id, message_data.value);

        return res.sendStatus(201);
    }
    catch (e) {
        return res
            .sendStatus(500);
    }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
exports.deleteAllIssueMessages = async function (req, res) {
    try {
        let issue_id = res.locals.issue_id;

        await issueMessagesService.deleteAllIssueMessages(issue_id);

        return res
            .sendStatus(204);
    }
    catch (e) {
        return res
            .sendStatus(500);
    }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
exports.deleteIssueMessageById = async function (req, res) {
    try {
        let issue_id = res.locals.issue_id;
        let {message_id} = req.params;

        await issueMessagesService.deleteIssueMessageById(issue_id, message_id);

        return res
            .sendStatus(204);
    }
    catch (e) {
        return res
            .sendStatus(500);
    }
}