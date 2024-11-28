let Joi = require('joi');
const {
    USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, DISPLAY_NAME_MIN_LENGTH, DISPLAY_NAME_MAX_LENGTH,
    ISSUE_TITLE_MIN_LENGTH, ISSUE_TITLE_MAX_LENGTH, ISSUE_DESCRIPTION_MIN_LENGTH, FEEDBACK_TITLE_MIN_LENGTH,
    FEEDBACK_TITLE_MAX_LENGTH, FEEDBACK_MESSAGE_MIN_LENGTH, FEEDBACK_MESSAGE_MAX_LENGTH
} = require("./constants");
const {PRIORITY_TYPES, STATUS_TYPES, USER_TYPES, FEEDBACK_TYPES} = require("./enums");
const mongoose = require("mongoose");

/// Implementing 'objectId' type
Joi = Joi.extend(joi => ({
    type: 'objectId',
    base: joi.string(),
    messages: {
        'objectId.invalid': "Issue ID '{{#value}}' is not a valid id.",
    },
    rules: {
        validateObjectId: {
            validate(id, helpers) {
                if (!mongoose.Types.ObjectId.isValid(id))
                    return helpers.error('objectId.invalid');

                return new mongoose.Types.ObjectId(id);
            }
        }
    }
}));

/// JOI USER SCHEMA
const USER_CREATE_SCHEMA = Joi.object({
    // CUSTOM ID
    id: Joi.string()
        .alphanum(),

    // ACCOUNT USERNAME
    username: Joi.string()
        .alphanum()
        .min(USERNAME_MIN_LENGTH)
        .max(USERNAME_MAX_LENGTH)
        .required(),

    // ACCOUNT WORKING E-MAIL
    email: Joi.string()
        .email()
        .required(),

    // ACCOUNT DISPLAY NAME
    displayName: Joi.string()
        .min(DISPLAY_NAME_MIN_LENGTH)
        .max(DISPLAY_NAME_MAX_LENGTH),

    // ACCOUNT TYPE
    type: Joi.string()
        .valid(...USER_TYPES),
});

const USER_SEARCH_SCHEMA = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(USERNAME_MIN_LENGTH)
        .max(USERNAME_MAX_LENGTH),

    email: Joi.string(),

    displayName: Joi.string(),

    type: Joi.string()
        .valid(...USER_TYPES),
});

const USER_UPDATE_SCHEMA = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(USERNAME_MIN_LENGTH)
        .max(USERNAME_MAX_LENGTH),

    email: Joi.string()
        .email(),

    displayName: Joi.string()
        .min(DISPLAY_NAME_MIN_LENGTH)
        .max(DISPLAY_NAME_MAX_LENGTH),

    type: Joi.string()
        .valid(...USER_TYPES),
});

/// JOI ISSUE SCHEMA
const ISSUE_CREATE_SCHEMA = Joi.object({
    author: Joi.string()
        .alphanum()
        .required(),

    staff: Joi.string()
        .alphanum(),

    priority: Joi.string()
        .valid(...PRIORITY_TYPES),

    tags: Joi.array()
        .items(Joi.string())
        .default([]),

    status: Joi.string()
        .valid(...STATUS_TYPES),

    title: Joi.string()
        .min(ISSUE_TITLE_MIN_LENGTH)
        .max(ISSUE_TITLE_MAX_LENGTH)
        .required(),

    description: Joi.string()
        .min(ISSUE_DESCRIPTION_MIN_LENGTH)
        .required(),

    attachments: Joi.array()
        .items(Joi.string()),

    comments: Joi.array()
        .items(Joi.string()),
});

const ISSUE_SEARCH_SCHEMA = Joi.object({
    author: Joi.string()
        .alphanum(),

    staff: Joi.string()
        .alphanum(),

    priority: Joi.string()
        .valid(...PRIORITY_TYPES),

    tags: Joi.array()
        .items(Joi.string()),

    status: Joi.string()
        .valid(...STATUS_TYPES),

    title: Joi.string(),

    fromDate: Joi.date(),

    toDate: Joi.date(),
})

const ISSUE_UPDATE_SCHEMA = Joi.object({
    staff: Joi.string()
        .alphanum(),

    priority: Joi.string()
        .valid(...PRIORITY_TYPES),

    tags: Joi.array()
        .items(Joi.string()),

    status: Joi.string()
        .valid(...STATUS_TYPES),
});

const ISSUE_DELETE_SCHEMA = Joi.object({
    issue_id: Joi.objectId().validateObjectId()
        .required(),
})

const ISSUE_BULK_UPDATE_SCHEMA = Joi.object({
    issue_ids: Joi.array()
        .unique()
        .items(Joi.objectId().validateObjectId())
        .required(),

    update_data: ISSUE_UPDATE_SCHEMA
        .required(),
});

const ISSUE_BULK_DELETE_SCHEMA = Joi.object({
    issue_ids: Joi.array()
        .unique()
        .items(Joi.objectId().validateObjectId())
        .required(),
})

/// JOI FEEDBACK SCHEMA
const FEEDBACK_CREATE_SCHEMA = Joi.object({
    author: Joi.string()
        .alphanum()
        .required(),

    title: Joi.string()
        .min(FEEDBACK_TITLE_MIN_LENGTH)
        .max(FEEDBACK_TITLE_MAX_LENGTH)
        .required(),

    type: Joi.string()
        .valid(...FEEDBACK_TYPES),

    message: Joi.string()
        .min(FEEDBACK_MESSAGE_MIN_LENGTH)
        .max(FEEDBACK_MESSAGE_MAX_LENGTH)
        .required(),

    rating: Joi.number()
        .min(1)
        .max(5)
        .required(),

    attachments: Joi.array()
        .items(Joi.string()),
});

const FEEDBACK_SEARCH_SCHEMA = Joi.object({
    author: Joi.string()
        .alphanum(),

    title: Joi.string(),

    type: Joi.string()
        .valid(...FEEDBACK_TYPES),

    rating: Joi.number()
        .min(1)
        .max(5),

    fromDate: Joi.date(),

    toDate: Joi.date(),
});

const FEEDBACK_BULK_DELETE_SCHEMA = Joi.object({
    feedback_ids: Joi.array()
        .unique()
        .items(Joi.objectId().validateObjectId())
        .required(),
})

module.exports = {
    USER_CREATE_SCHEMA,
    USER_SEARCH_SCHEMA,
    USER_UPDATE_SCHEMA,

    ISSUE_CREATE_SCHEMA,
    ISSUE_SEARCH_SCHEMA,
    ISSUE_UPDATE_SCHEMA,
    ISSUE_BULK_UPDATE_SCHEMA,
    ISSUE_DELETE_SCHEMA,
    ISSUE_BULK_DELETE_SCHEMA,

    FEEDBACK_CREATE_SCHEMA,
    FEEDBACK_SEARCH_SCHEMA,
    FEEDBACK_BULK_DELETE_SCHEMA,
}