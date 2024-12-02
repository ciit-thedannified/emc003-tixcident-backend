const {ISSUE_SEARCH_SCHEMA, ISSUE_CREATE_SCHEMA, ISSUE_UPDATE_SCHEMA, ISSUE_BULK_UPDATE_SCHEMA,
    ISSUE_BULK_DELETE_SCHEMA
} = require("../../../../../utils/helpers");
const {filterBuilder, regexpBuilder, dateRangeBuilder} = require("../../../../../utils/builders");
const issuesService = require("../services/issues_service.js");
const isBoolean = require("validator/lib/isBoolean");
const {boolean} = require("boolean");
const {UserTypes} = require("../../../../../utils/enums");
const {DEFAULT_PAGINATION_PAGE, DEFAULT_PAGINATION_ITEMS} = require("../../../../../utils/constants");

/**
 * Fetches all existing issues in the database.
 * @param {Request} req Request the request object
 * @param {Response} res Response the response object
 * @returns {Promise<void>}
 */
exports.getAllIssues = async function (req, res) {
    try {
        // Pagination query parameters
        let {page = DEFAULT_PAGINATION_PAGE, items = DEFAULT_PAGINATION_ITEMS, authorId} = req.query;
        let {user_id, user_role} = res.locals;

        if (user_role === UserTypes.User && (authorId !== user_id)) {
            return res
                .status(403)
                .json({
                    message: "User can only request their own issue documents."
                });
        }

        // Building the query filter before requesting data.
        let query = filterBuilder()
            .appendField("author", authorId)
            .build();

        let _query = await issuesService.findAllIssues(query, null, {
            skip: (page - 1) * items,
            limit: items,
        });

        return res
            .status(200)
            .json(_query);

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
 * @returns {Promise<void>}
 */
exports.getIssueById = async function (req, res) {
    try {
        let {user_id, user_role} = res.locals;
        let {issue_id} = req.params;

        // Querying specific issue by id
        let issue = await issuesService.findIssueById(issue_id);

        if (!issue)
            return res
                .status(404)
                .json({
                    message: `Issue ID ${issue_id} does not exist.`,
                });

        if (user_role === UserTypes.User && issue['author']?.id !== user_id) {
            return res
                .sendStatus(404);
        }

        // Provide the issue details to client.
        return res
            .status(200)
            .json(issue);

    } catch (e) {
        if (e.code === '40001' || e.code === '40002') {
            return res
                .status(404)
                .json({
                    message: e.message,
                });
        }

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
exports.createIssue = async function (req, res) {
    try {
        let issue_data = ISSUE_CREATE_SCHEMA.validate(req.body, {
            allowUnknown: false, abortEarly: true,
        });
        let {user_id} = res.locals;

        if (issue_data.error)
            return res
                .status(400)
                .json({
                    message: 'Malformed/Invalid request.',
                });

        let issue = await issuesService.createIssue({author: user_id, ...issue_data.value});

        return res
            .status(201)
            .json({
                id: issue._id,
            });
    } catch (e) {
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
exports.updateIssueById = async function (req, res) {
    try {
        let {issue_id} = req.params;
        let issue_update = ISSUE_UPDATE_SCHEMA.validate(req.body);
        let update;     // Holds 'issue_update.value'
        let _update;    // Building filterBuilder for 'update'

        if (issue_update.error) // Return 400 (Bad Request) if provided data body is malformed/invalid.
            return res
                .status(400)
                .json({
                    message: "Malformed/Invalid request."
                });

        update = issue_update.value;

        _update = filterBuilder()
            .appendField("staff", update?.staff)
            .appendField("priority", update?.priority)
            .appendField("tags", update?.tags, (value) => value !== undefined && value.length > 0 ? {$in: value} : undefined)
            .appendField("status", update?.status)
            .build();

        // Perform an update to provided issue_id
        await issuesService.updateIssueById(issue_id, _update);

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
 * @returns {Promise<*|void>}
 */
exports.updateManyIssues = async function (req, res) {
    try {
        let payload = ISSUE_BULK_UPDATE_SCHEMA.validate(req.body, {
            allowUnknown: false, abortEarly: true,
        });
        let update;
        let _update;
        let issue_ids;

        if (payload.error)
            return res
                .status(400)
                .json({
                    message: 'Malformed/Invalid request.'
                });

        issue_ids = payload.value.issue_ids;
        update = payload.value.update_data;

        _update = filterBuilder()
            .appendField('staff', update?.staff)
            .appendField('priority', update?.priority)
            .appendField('tags', update?.tags, (value) => value !== undefined && value.length > 0 ? {$in: value} : undefined)
            .appendField("status", update?.status)
            .build();

        await issuesService.bulkUpdateIssues(issue_ids, _update);

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
 * @returns {Promise<*|void>}
 */
exports.deleteIssueById = async function (req, res) {
    try {
        let {hardDelete = "false"} = req.query;
        let {issue_id} = req.params;

        if (!isBoolean(hardDelete))
            return res
                .status(400)
                .json({
                    message: "query 'hardDelete' must be a boolean value."
                });

        await issuesService.deleteIssueById(issue_id, boolean(hardDelete));

        return res
            .sendStatus(204);
    }
    catch (e) {
        console.error(e);

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
exports.deleteManyIssues = async function (req, res) {
    try {
        let {hardDelete = "false"} = req.query;

        let payload;

        if (!isBoolean(hardDelete))
            return res
                .status(400)
                .json({
                    message: "'hardDelete' must be a boolean value."
                });

        payload = ISSUE_BULK_DELETE_SCHEMA.validate(req.body, {
            allowUnknown: false, abortEarly: true,
        });

        if (payload.error)
            return res
                .status(400)
                .json({
                    message: payload.error.message,
                })

        await issuesService.bulkDeleteIssues(payload.value.issue_ids, boolean(hardDelete));

        return res
            .sendStatus(204)
    }
    catch (e) {
        return res
            .sendStatus(500);
    }
}