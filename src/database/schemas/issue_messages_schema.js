const {model, Schema} = require('mongoose');

const IssueMessagesSchema = new Schema({
    issue_id: {
        type: Schema.Types.ObjectId,
        ref: 'issues',
        required: true,
        immutable: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        immutable: true,
    },
    message: {
        type: Schema.Types.String,
        required: true,
    }
}, {
    timestamps: true,
});

const IssueMessagesModel = model('issue-messages', IssueMessagesSchema);

module.exports = {
    IssueMessagesSchema,
    IssueMessagesModel,
}