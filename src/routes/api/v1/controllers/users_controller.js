const usersService = require('../services/users_service');
const {USER_SEARCH_SCHEMA, USER_CREATE_SCHEMA, USER_UPDATE_SCHEMA} = require("../../../../../utils/helpers");
const {filterBuilder, regexpBuilder} = require("../../../../../utils/builders");
const FirebaseAdmin = require("../../../../firebase/firebase-admin");
const {DEFAULT_PAGINATION_PAGE, DEFAULT_PAGINATION_ITEMS} = require("../../../../../utils/constants");
const {USER_TYPES} = require("../../../../../utils/enums");

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<*|void>}
 */
exports.getAllUsers = async function (req, res) {
    try {
        let {page = DEFAULT_PAGINATION_PAGE, items = DEFAULT_PAGINATION_ITEMS, type} = req.params;

        if (!USER_TYPES.includes(type)) {
            return res
                .sendStatus(400)
        }

        let query = filterBuilder()
            .appendField("type", type)
            .build();

        let _query = await usersService.findAllUsers(query, null, {
            skip: (page - 1) * items,
            limit: items,
        });

        return res
            .status(200)
            .json(_query);
    } catch (e) {
        return res
            .sendStatus(500);
    }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<*|void>}
 */
exports.getUserById = async function (req, res) {
    try {
        let {user_id} = req.params;

        // Querying specified user by username
        let user = await usersService.findUserById(user_id);

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
    } catch (e) {
        return res.sendStatus(500);
    }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<*|void>}
 */
exports.createUser = async (req, res) => {
    try {
        // Validate the user_credentials body if it contains all required & optional fields
        const user_credentials = await USER_CREATE_SCHEMA.validate(res.locals.filter, {
            allowUnknown: false,
            abortEarly: true,
        });

        // Return a 'Bad Request' status if the schema invalidates the payload.
        if (user_credentials.error)
            return res
                .status(400)
                .json({
                    message: 'Malformed/Invalid request.',
                });

        await usersService.createUser(user_credentials);

        return res
            .sendStatus(201);
    } catch (e) {
        return res
            .sendStatus(500);
    }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<*>}
 */
exports.updateUserById = async function (req, res) {
    let {user_id} = req.params;

    try {
        let user_credentials = USER_UPDATE_SCHEMA.validate(res.locals.filter, {
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

        await usersService.updateUserById(user_id, user_credentials);

        return res
            .sendStatus(204)
    } catch (e) {
        return res
            .sendStatus(500);
    }
}


/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<*|void>}
 */
exports.deleteUserById = async function (req, res) {
    try {
        let {user_id} = req.params;

        await usersService.deleteUserById(user_id);
        await FirebaseAdmin.auth().deleteUser(user_id)
            .catch(e => null); // ignore if user is already deleted to Firebase Auth database.

        return res
            .sendStatus(204);
    }
    catch (e) {
        return res
            .sendStatus(500);
    }
}