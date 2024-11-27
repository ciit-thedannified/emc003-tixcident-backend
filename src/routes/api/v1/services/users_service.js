const {DEFAULT_MAX_TIME_MS} = require("../../../../../utils/constants");
const {UsersModel} = require("../../../../database/schemas/users_schema");

/**
 *
 * @param {RootFilterQuery} filters
 * @param {ProjectionType} projections
 * @param {QueryOptions} options
 * @returns {Promise<void>}
 */
exports.findAllUsers = async function (filters, projections = {}, options = {}) {
    return UsersModel.find(filters, projections, {maxTimeMS: DEFAULT_MAX_TIME_MS, ...options});
}

/**
 *
 * @param {string} user_id
 * @param {ProjectionType} projections
 * @param {QueryOptions} options
 */
exports.findIssueById = async function (user_id, projections = {}, options = {}) {
    return UsersModel.findById(user_id, projections, {maxTimeMS: DEFAULT_MAX_TIME_MS, ...options});
}

/**
 *
 * @param user_data
 * @returns {Promise<void>}
 */
exports.createUser = async function (user_data) {
    return UsersModel.create(user_data);
}

exports.updateUserById = async function (user_data, new_user_data) {
    return UsersModel.findByIdAndUpdate(user_data, {
        $set: new_user_data,
    }, {new: true});
}

exports.deleteUserById = async function (user_id, hardDelete = false) {
    if (hardDelete) {   // Perform hard delete (permanent deletion) if true
        return UsersModel.findByIdAndDelete(user_id);
    }

    return UsersModel.findByIdAndUpdate(user_id, {
        $set: {
            isDeleted: true,
            deletedAt: Date.now(),
        }
    });
}