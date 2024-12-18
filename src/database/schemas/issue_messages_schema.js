const {model, Schema} = require('mongoose');
const {onIssueMessageFind} = require("../middlewares/md_issue_messages_schema");

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

IssueMessagesSchema.pre('find', onIssueMessageFind);

IssueMessagesSchema.pre('findOne', onIssueMessageFind);

const IssueMessagesModel = model('issue-messages', IssueMessagesSchema);

module.exports = {
    IssueMessagesSchema,
    IssueMessagesModel,
}