const {model, Schema} = require('mongoose');

const IssueMessagesSchema = new Schema({
    issue_id: {
        type: Schema.Types.String,
        ref: 'issues',
        required: true,
        immutable: true,
    },
    author: {
        type: Schema.Types.String,
        ref: 'users',
        required: true,
        immutable: true,
    },
    message: {
        type: Schema.Types.String,
        required: true,
    },
    attachments: {
        type: [Schema.Types.String],
        default: [],
    }
}, {
    timestamps: true,
});

const IssueMessagesModel = model('issue-messages', IssueMessagesSchema);

module.exports = {
    IssueMessagesSchema,
    IssueMessagesModel,
}