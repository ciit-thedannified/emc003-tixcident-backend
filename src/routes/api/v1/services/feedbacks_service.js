const {FeedbacksModel} = require("../../../../database/schemas/feedbacks_schema");
const mongoose = require("mongoose");
const {IssuesModel} = require("../../../../database/schemas/issues_schema");

/**
 *
 * @param {RootFilterQuery} feedback_id
 * @param {ProjectionType} projections
 * @param {QueryOptions} options
 * @returns {Promise<void>}
 */

exports.findAllFeedbacks = async function(filters = {}, projections = {}, options = {}) {
    return FeedbacksModel.find(filters, projections, options);
}

/**
 *
 * @param {string} feedback_id
 * @param {ProjectionType} projections
 * @param {QueryOptions} options
 * @returns {Promise<void>}
 */

exports.findFeedbackById = async function(feedback_id, projections = {}, options = {}) {
    return FeedbacksModel.findById(feedback_id, projections, options);
}

exports.createFeedback = async function (feedback_data) {
    return FeedbacksModel.create(feedback_data);
}

exports.deleteFeedbackById = async function(feedback_id, hardDelete = false) {
    if (hardDelete) {
        return FeedbacksModel.findByIdAndDelete(feedback_id);
    }

    return FeedbacksModel.findByIdAndUpdate(feedback_id, {
        $set: {
            isDeleted: true,
            deletedAt: Date.now(),
        }
    })
}

exports.bulkDeleteFeedbacks = async function (feedback_ids, hardDelete = false) {
    let objectIds = feedback_ids.map(feedback_id => new mongoose.Types.ObjectId(feedback_id));

    if (hardDelete) { // Perform hard delete (permanent deletion) if true
        return FeedbacksModel.deleteMany({
            _id: {$in: objectIds},
        });
    }

    return FeedbacksModel.updateMany({
        _id: {$in: objectIds},
    }, {
        $set: {
            isDeleted: true,
            deletedAt: Date.now(),
        }
    });
}