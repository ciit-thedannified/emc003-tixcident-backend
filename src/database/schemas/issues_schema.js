const {model, Schema} = require("mongoose");
const {PRIORITY_TYPES, STATUS_TYPES} = require("../../../utils/enums.js");
const {ISSUE_TITLE_MAX_LENGTH, ISSUE_TITLE_MIN_LENGTH} = require("../../../utils/constants.js");
const {isIssueDeleted, onIssueCreated, onIssueFind, onIssueDeleted, beforeBulkIssuesDeleted, onBulkIssuesDeleted} = require("../middlewares/md_issues_schema");
const {ISSUE_TYPES, IssueTypes, PriorityTypes, StatusTypes} = require("../../../utils/enums");

const IssuesSchema = new Schema(
    {
        author: {
            type: Schema.Types.String,
            ref: 'users',
            required: [true, 'Issue must have an author.'],
            immutable: true,
        },
        staff: {
            type: Schema.Types.String,
            ref: 'users',
            default: null,
        },
        priority: {
            type: Schema.Types.String,
            enum: {
                values: PRIORITY_TYPES,
                message: "{VALUE} is not a valid priority value.",
            },
            default: PriorityTypes.None,
            uppercase: true
        },
        type: {
            type: Schema.Types.String,
            enum: {
                values: ISSUE_TYPES,
                message: "{VALUE} is not a valid issue type.",
            },
            default: IssueTypes.None,
            uppercase: true,
        },
        tags: {
            type: [Schema.Types.String],
            default: [],
        },
        status: {
            type: Schema.Types.String,
            enum: {
                values: STATUS_TYPES,
                message: "{VALUE} is not a valid status value.",
            },
            default: StatusTypes.Open,
            uppercase: true
        },
        title: {
            type: Schema.Types.String,
            required: [true, "Issue must have a subject title."],
            minLength: [ISSUE_TITLE_MIN_LENGTH, 'Subject title must be at least 10 characters long.'],
            maxLength: [ISSUE_TITLE_MAX_LENGTH, 'Subject title must only be 10-60 characters long.'],
        },
        description: {
            type: Schema.Types.String,
            required: [true, "Issue cannot have an empty content."],
            minLength: [30, "Issue content must contain at least 30 characters."],
        },
        attachments: {
            type: [Schema.Types.String],
            default: [],
        },
        isDeleted: {
            type: Schema.Types.Boolean,
            default: false,
        },
        deletedAt: {
            type: Schema.Types.Date,
            default: null,
        }
    }, {
        timestamps: true
    }
);

/**
 * Whenever we query bulk issue data.
 * - issue must not be marked as deleted
 * - do not show '__v', 'isDeleted'
 */
IssuesSchema.pre('find', onIssueFind);

IssuesSchema.pre('findOne', onIssueFind)

IssuesSchema.pre('save', onIssueCreated);

IssuesSchema.pre('deleteMany', beforeBulkIssuesDeleted)

IssuesSchema.post('findOne', isIssueDeleted);

IssuesSchema.post( 'findOneAndUpdate', isIssueDeleted);

IssuesSchema.post('findOneAndDelete', onIssueDeleted);

IssuesSchema.post('deleteMany', onBulkIssuesDeleted);

const IssuesModel = model('issues', IssuesSchema);

module.exports = {
    IssuesModel,
    IssuesSchema
};