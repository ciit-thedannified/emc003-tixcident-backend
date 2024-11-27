const {UsersModel} = require("../schemas/users_schema");
const {DEFAULT_MAX_TIME_MS} = require("../../../utils/constants");
const {ObjectId} = require("mongodb");

/// PRE HOOKS

// pre - 'save'
/**
 *
 * @param {NextFunction} next
 * @returns {Promise<*>}
 */
exports.onFeedbackCreated = async function (next) {
    const {author} = this;
    let _id;

    let authorExists = await UsersModel.findOne({id: author}, {}, {maxTimeMS: DEFAULT_MAX_TIME_MS});

    if (!authorExists) return next(new Error("User does not exists."));

    _id = authorExists.get('_id');

    this.author = new ObjectId(_id);
    return next();
}