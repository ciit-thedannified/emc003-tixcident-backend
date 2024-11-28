const {IssueMessagesModel} = require("../../../../database/schemas/issue_messages_schema");


exports.findAllIssueMessages = async function (filters = {}, projections = {}, options = {}) {
    return IssueMessagesModel.find(filters, projections, options);
}

exports.findIssueMessageById = async function (issue_id, message_id, projections = {}, options = {}) {
    return IssueMessagesModel.findOne({
        _id: message_id,
        issue_id: issue_id,
    }, projections, options);
}

exports.createIssueMessage = async function (issue_id, message_data) {
    return IssueMessagesModel.create({issue_id, ...message_data});
}

exports.deleteIssueMessageById = async function (issue_id, message_id) {
    return IssueMessagesModel.deleteOne({
        _id: message_id,
        issue_id: issue_id,
    });
}

exports.deleteAllIssueMessages = async function (issue_id) {
    return IssueMessagesModel.deleteMany({
        issue_id: issue_id
    });
}