const {IssuesModel} = require("../../../../database/schemas/issues_schema");
const {DEFAULT_MAX_TIME_MS} = require("../../../../../utils/constants");
const mongoose = require("mongoose");

/**
 *
 * @param {RootFilterQuery} filters
 * @param {ProjectionType} projections
 * @param {QueryOptions} options
 * @returns {Promise<void>}
 */
exports.findAllIssues = async function (filters = {}, projections = {}, options = {}) {
    return IssuesModel.find(filters, projections, {maxTimeMS: DEFAULT_MAX_TIME_MS, ...options});
}

/**
 *
 * @param {string} issue_id
 * @param {ProjectionType} projections
 * @param {QueryOptions} options
 */
exports.findIssueById = async function (issue_id, projections = {}, options = {}) {
    return IssuesModel.findById(issue_id, projections, {maxTimeMS: DEFAULT_MAX_TIME_MS, ...options});
}

/**
 *
 * @param issue_data
 * @returns {Promise<void>}
 */
exports.createIssue = async function (issue_data) {
    return IssuesModel.create(issue_data);
}

exports.updateIssueById = async function (issue_id, new_issue_data) {
    return IssuesModel.findByIdAndUpdate(issue_id, {
        $set: new_issue_data,
    }, {new: true});
}

exports.bulkUpdateIssues = async function (issue_ids, new_issue_data) {
    let objectIds = issue_ids.map(issue_id => new mongoose.Types.ObjectId(issue_id));

    return IssuesModel.updateMany({
        _id: {$in: objectIds},
    }, {
        $set: new_issue_data,
    });
}

exports.deleteIssueById = async function (issue_id, hardDelete = false) {
    if (hardDelete) {   // Perform hard delete (permanent deletion) if true
        return IssuesModel.findByIdAndDelete(issue_id);
    }

    return IssuesModel.findByIdAndUpdate(issue_id, {
        $set: {
            isDeleted: true,
            deletedAt: Date.now(),
        }
    });
}

/**
 *
 * @param {string[]} issue_ids
 * @param {boolean} hardDelete
 */
exports.bulkDeleteIssues = async function (issue_ids, hardDelete = false) {
    let objectIds = issue_ids.map(issue_id => new mongoose.Types.ObjectId(issue_id));

    if (hardDelete) { // Perform hard delete (permanent deletion) if true
        return IssuesModel.deleteMany({
            _id: {$in: objectIds},
        });
    }

    return IssuesModel.updateMany({
        _id: {$in: objectIds},
    }, {
        $set: {
            isDeleted: true,
            deletedAt: Date.now(),
        }
    });
}