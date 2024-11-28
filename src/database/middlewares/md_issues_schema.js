const {Document} = require('mongoose');
const {UsersModel} = require("../schemas/users_schema");
const {DEFAULT_MAX_TIME_MS} = require("../../../utils/constants");
const {ObjectId} = require("mongodb");
const {IssueNotFound} = require("../../../utils/errors");
const {onDocumentWithAuthorCreated} = require("./md_abstract_schema");

/// PRE HOOKS

// pre - 'find', 'findOne'
exports.onIssueFind = async function (next) {
    this
        .where({isDeleted: false})
        .select('-__v -isDeleted -deletedAt')
        .populate({
            path: 'author',
            select: '-createdAt -updatedAt -__v -email -_id',
        })
        .populate({
            path: 'staff',
            select: '-createdAt -updatedAt -__v -email -_id',
        });

    return next();
}

// pre - 'save'
exports.onIssueCreated = onDocumentWithAuthorCreated;

/// POST HOOKS

// post - 'findOne', 'findOneAndUpdate'
/**
 * @param {Document} doc
 * @param {NextFunction} next
 * @returns {Promise<*>}
 */
exports.isIssueDeleted = async function (doc, next) {
    if (!doc)
        return next(new IssueNotFound('Issue document does not exist.', '40001'));

    let {_id, isDeleted} = doc;

    if (isDeleted)
        return next(new IssueNotFound(`Issue ID ${_id} has already been deleted.`, '40002'));

    return next();
}

