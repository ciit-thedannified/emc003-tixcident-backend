const {model, Schema} = require('mongoose');
const {FEEDBACK_TITLE_MIN_LENGTH, FEEDBACK_TITLE_MAX_LENGTH, FEEDBACK_MESSAGE_MIN_LENGTH, FEEDBACK_MESSAGE_MAX_LENGTH} = require("../../../utils/constants");

const FeedbacksSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
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
    }
}, {
    timestamps: true,
});

const FeedbacksModel = model('feedbacks', FeedbacksSchema);

module.exports = {
    FeedbacksSchema,
    FeedbacksModel,
}