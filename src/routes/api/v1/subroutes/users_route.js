/*
 * ROUTER URI: /api/v1/users
 *
 * For handling user-related APIs
 */
const {Router} = require('express');
const {UsersModel} = require( "../../../../database/schemas/users_schema.js");
const {USER_CREATE_SCHEMA, USER_UPDATE_SCHEMA} = require("../../../../../utils/helpers");

const API_V1_USERS = Router({
    strict: true,
    caseSensitive: true,
});

/**
 * Fetches all account details with pagination
 */
API_V1_USERS.get('/', async function (req, res){
    try {
        let {page = 0, items = 0} = req.params;

        let query = await UsersModel
            .find(null, null, {
                skip: page * items,
                limit: items,
            });

        return res
            .status(200)
            .json(query);
    }
    catch (e) {
        return res
            .sendStatus(500);
    }
});

/**
 * Fetches the account details of a specific user
 */
API_V1_USERS.get('/:user_id', async (req, res) => {
    try {
        let {user_id} = req.params;

        // Querying specified user by username
        let user = await UsersModel.findOne({
            id: user_id
        }, {
            __v: 0,
        }, {
            maxTimeMS: 10_000,
        });

        // Return a 'Not Found' status if the user does not exist.
        if (!user) {
            return res
                .status(404)
                .json({
                    message: `User '${user_id}' not found.`
                });
        }

        // Provide the user details to client.
        return res
            .status(200)
            .json(user);
    }
    catch (e) {
        return res.sendStatus(500);
    }
});

/**
 * Creates a new user data in the application.
 */
API_V1_USERS.post('/', async (req, res) => {
    try {
        // Validate the user_credentials body if it contains all required & optional fields
        const user_credentials = await USER_CREATE_SCHEMA.validate(req.body, {
            allowUnknown: false,
            abortEarly: true,
        });

        // Return a 'Bad Request' status if the schema invalidates the payload.
        if (user_credentials.error)
            return res
                .status(400)
                .json({
                    message: 'Your request issued a malformed request',
                });

        let newUser = new UsersModel(user_credentials.value);

        await newUser.save()

        return res
            .sendStatus(201);
    }
    catch (e) {
        console.error(e);
        return res
            .sendStatus(500);
    }
});

API_V1_USERS.patch('/:user_id', async (req, res) => {
    let {user_id} = req.params;

    try {
        let user_credentials = USER_UPDATE_SCHEMA.validate(req.body, {
            allowUnknown: false,
            abortEarly: true,
        });

        // Return a 'Bad Request' status if the schema invalidates the payload.
        if (user_credentials.error)
            return res
                .status(400)
                .json({
                    message: user_credentials.error.details[0].message,
                });

        await UsersModel.findOneAndUpdate({
            id: user_id,
        }, {
            $set: user_credentials.value
        }, {
            maxTimeMS: 15_000,
        })
            .then(u => {
                return res
                    .status(204)
                    .json(u);
            })
            .catch(e => {
                return res
                    .sendStatus(400);
            });

    }
    catch (e) {
        console.error(e);

        return res
            .status(500)
            .json({
                message: e.message,
            })
    }
});



module.exports = API_V1_USERS;