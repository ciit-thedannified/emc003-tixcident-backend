const {model, Schema} = require('mongoose');
const {FEEDBACK_TITLE_MIN_LENGTH, FEEDBACK_TITLE_MAX_LENGTH, FEEDBACK_MESSAGE_MIN_LENGTH, FEEDBACK_MESSAGE_MAX_LENGTH} = require("../../../utils/constants");
const {onFeedbackCreated} = require("../middlewares/md_feedbacks_schema");
const {FEEDBACK_TYPES, FeedbackTypes} = require("../../../utils/enums");

const FeedbacksSchema = new Schema({
    author: {
        type: Schema.Types.String,
        ref: 'users',
        required: true,
        immutable: true,
    },
    title: {
        type: Schema.Types.String,
        minLength: FEEDBACK_TITLE_MIN_LENGTH,
        maxLength: FEEDBACK_TITLE_MAX_LENGTH,
        required: true,
        immutable: true,
    },
    type: {
        type: Schema.Types.String,
        enum: {
            values: FEEDBACK_TYPES,
            message: "{VALUE} is not a valid feedback type"
        },
        default: FeedbackTypes.Others,
        required: true,
        immutable: true,
    },
    message: {
        type: Schema.Types.String,
        minLength: FEEDBACK_MESSAGE_MIN_LENGTH,
        maxLength: FEEDBACK_MESSAGE_MAX_LENGTH,
        required: true,
        immutable: true,
    },
    rating: {
        type: Schema.Types.Number,
        min: 1,
        max: 5,
        required: true,
        immutable: true,
    },
    attachments: {
        type: [Schema.Types.String],
        default: [],
    },
    isDeleted: {
        type: Schema.Types.Boolean,
        default: false
    },
    deletedAt: {
        type: Schema.Types.Date,
        default: null,
    }
}, {
    timestamps: true,
});

FeedbacksSchema.pre('save', onFeedbackCreated);

const FeedbacksModel = model('feedbacks', FeedbacksSchema);

module.exports = {
    FeedbacksSchema,
    FeedbacksModel,
}