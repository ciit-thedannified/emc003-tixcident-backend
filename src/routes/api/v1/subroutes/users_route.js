/*
 * ROUTER URI: /api/v1/users
 *
 * For handling user-related APIs
 */
const {Router} = require('express');
const usersController = require('../controllers/users_controller')
const {checkAdminRole, verifyToken, getUserRole} = require("../middlewares/md_authorization");

const API_V1_USERS = Router({
    strict: true,
    caseSensitive: true,
});

API_V1_USERS.use(verifyToken);
API_V1_USERS.use(getUserRole);

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
API_V1_USERS.post('/', checkAdminRole, usersController.createUser);

/**
 *
 */
API_V1_USERS.patch('/:user_id', checkAdminRole, usersController.updateUserById);

/**
 *
 */
API_V1_USERS.delete('/:user_id', checkAdminRole, usersController.deleteUserById);

module.exports = API_V1_USERS;