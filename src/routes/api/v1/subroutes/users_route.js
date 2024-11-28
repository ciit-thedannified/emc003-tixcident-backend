/*
 * ROUTER URI: /api/v1/users
 *
 * For handling user-related APIs
 */
const {Router} = require('express');
const {UsersModel} = require( "../../../../database/schemas/users_schema.js");
const {USER_CREATE_SCHEMA, USER_UPDATE_SCHEMA} = require("../../../../../utils/helpers");
const usersController = require('../controllers/users_controller')

const API_V1_USERS = Router({
    strict: true,
    caseSensitive: true,
});

/**
 * Fetches all account details with pagination
 */
API_V1_USERS.get('/', usersController.getAllUsers);

/**
 * Fetches the account details of a specific user
 */
API_V1_USERS.get('/:user_id', usersController.getUserById);

/**
 * Creates a new user data in the application.
 */
API_V1_USERS.post('/', usersController.createUser);

/**
 *
 */
API_V1_USERS.patch('/:user_id', usersController.updateUserById);

/**
 *
 */
API_V1_USERS.delete('/:user_id', usersController.deleteUserById);

module.exports = API_V1_USERS;