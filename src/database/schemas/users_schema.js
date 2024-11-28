const {Schema, model} = require('mongoose');
const {
    DISPLAY_NAME_MAX_LENGTH,
    DISPLAY_NAME_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
    USERNAME_MIN_LENGTH
} = require("../../../utils/constants.js");
const {USER_TYPES} = require("../../../utils/enums.js");
const isEmail = require('validator/lib/isEmail.js');

const UsersSchema = new Schema(
    {
        id: {
            type: Schema.Types.String,
            required: [true, "User ID cannot be empty or null."],
            unique: true,
            immutable: true,
        },
        username: {
            type: Schema.Types.String,
            required: [true, "Username cannot be empty or null."],
            minLength: [USERNAME_MIN_LENGTH, `Username must be at least ${USERNAME_MIN_LENGTH} characters long.`],
            maxLength: [USERNAME_MAX_LENGTH, `Username must only be ${USERNAME_MIN_LENGTH}-${USERNAME_MAX_LENGTH} characters long.`],
            lowercase: true,
            unique: true,
        },
        email: {
            type: Schema.Types.String,
            validate: {
                validator: (email) => isEmail(email),
                message: (email) => `Provided e-mail (${email}) is not a valid e-mail address.`,
            },
            required: [true, "E-mail address cannot be empty of null"],
            unique: true,
        },
        displayName: {
            type: Schema.Types.String,
            validate: {
                validator: (name) => {
                    if (name == null || name === "") return true;

                    return (name.length >= DISPLAY_NAME_MIN_LENGTH && name.length <= DISPLAY_NAME_MAX_LENGTH);
                },
                message: () => `Display name must be ${DISPLAY_NAME_MIN_LENGTH}-${DISPLAY_NAME_MAX_LENGTH} characters long.`
            },
            default: null
        },
        type: {
            type: Schema.Types.String,
            enum: {
                values: USER_TYPES,
                message: "{VALUE} is not a valid user type."
            },
            default: USER_TYPES[0]
        },
    },
    {
        timestamps: true,
    }
);

UsersSchema.pre('find', async function(next) {
    this
        .select('-__v');
    return next();
});

const UsersModel = model('users', UsersSchema);

module.exports = {
    UsersModel,
    UsersSchema
};