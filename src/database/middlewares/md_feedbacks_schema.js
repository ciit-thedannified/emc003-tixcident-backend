const {UsersModel} = require("../schemas/users_schema");
const {DEFAULT_MAX_TIME_MS} = require("../../../utils/constants");
const {ObjectId} = require("mongodb");
const {onDocumentWithAuthorCreated} = require("./md_abstract_schema");

/// PRE HOOKS

// pre - 'save'
exports.onFeedbackCreated = onDocumentWithAuthorCreated;

/**
 * @param {NextFunction} next
 * @returns {Promise<*>}
 */
exports.onFeedbackFind = async function (next) {
    this
        .where({isDeleted: false})
        .select('-__v -isDeleted -deletedAt')
        .populate({
            path: 'author',
            select: '-createdAt -updatedAt -__v -email -_id',
        });

    return next();
}