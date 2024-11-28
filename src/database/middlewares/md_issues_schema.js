const {Document} = require('mongoose');
const {IssueNotFound} = require("../../../utils/errors");
const {onDocumentWithAuthorCreated} = require("./md_abstract_schema");
const {IssueMessagesModel} = require("../schemas/issue_messages_schema");

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

// pre - 'deleteMany'
exports.beforeBulkIssuesDeleted = async function (next) {
    let filter = this.getFilter();

    this._targetIssueIds = await this.model.find(filter).select('_id');
    next();
}

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

// post - 'findOneAndDelete'
/**
 * @param {Document} doc
 * @param {NextFunction} next
 * @returns {Promise<*>}
 */
exports.onIssueDeleted = async function (doc, next) {
    let {_id} = doc;

    await IssueMessagesModel.deleteMany({
        issue_id: _id,
    });

    return next();
}

// post - 'deleteMany'
/**
 * @param {Document} doc
 * @param {NextFunction} next
 * @returns {Promise<*>}
 */
exports.onBulkIssuesDeleted = async function (doc, next) {
    if (this._targetIssueIds && this._targetIssueIds.length > 0) {
        const issue_ids = this._targetIssueIds.map(issue => issue._id);

        await IssueMessagesModel.deleteMany({ issue_id: { $in: issue_ids } });
    }

    next();
}