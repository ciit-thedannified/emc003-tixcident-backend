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
exports.findUserById = async function (user_id, projections = {}, options = {}) {
    return UsersModel.findOne({
        id: user_id,
    }, projections, {maxTimeMS: DEFAULT_MAX_TIME_MS, ...options});
}

/**
 *
 * @param user_data
 * @returns {Promise<void>}
 */
exports.createUser = async function (user_data) {
    return UsersModel.create(user_data);
}

exports.updateUserById = async function (user_id, new_user_data) {
    return UsersModel.findOneAndUpdate({
        id: user_id,
    }, {
        $set: new_user_data,
    }, {new: true});
}

exports.deleteUserById = async function (user_id) {
    return UsersModel.findOneAndDelete({
        id: user_id,
    });
}