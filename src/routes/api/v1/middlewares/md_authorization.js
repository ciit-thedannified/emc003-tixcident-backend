const FirebaseAdmin = require("../../../../firebase/firebase-admin.js");
const usersService = require("../services/users_service");
const issuesService = require("../services/issues_service");
const {UserTypes} = require("../../../../../utils/enums");
const {boolean} = require('boolean');

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<*>}
 */
exports.verifyToken = async (req, res, next) => {
    try {
        const account_provisioning = req.headers['x-account-provision'];
        const authHeader = req.headers["authorization"];
        let token;

        if (boolean(account_provisioning)) {
            return next();
        }

        if (!authHeader || !authHeader.startsWith("Bearer "))
            return res
                .status(401).json({message: "Missing or invalid Authorization header."});

        token = authHeader.split(" ")[1];

        const decodedToken = await FirebaseAdmin.auth().verifyIdToken(token);

        if (decodedToken) {
            res.locals.user_id = decodedToken.uid;
            return next();
        }

        return res
            .status(401)
            .json({
                message: 'Unauthorized access to requested resource.'
            });
    }
    catch (e) {
        // Invalid token was provided by the user
        if (e['errorInfo'] === 'auth/argument-error')
            return res
                .status(400)
                .json({
                    message: 'Invalid authorization token was provided.'
                })

        // Other exceptions
        return res
            .sendStatus(500);
    }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
exports.getUserRole = async (req, res, next) => {
    try {
        const account_provisioning = req.headers['x-account-provision'];

        if (boolean(account_provisioning)) {
            return next();
        }

        let user = await usersService.findUserById(res.locals.user_id, {_id: 1, type: 1});

        if (!user)
            return res
                .status(401)
                .json({
                    message: "Unknown user."
                });

        res.locals.user_role = user.type;

        return next();
    }
    catch (e) {
        return res
            .sendStatus(500);
    }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
exports.checkAdminRole = async function (req, res, next) {
    try {
        let account_provisioning = req.headers['x-account-provision'];
        let {user_role} = res.locals;

        if (boolean(account_provisioning) === true)
            return next();

        if (user_role !== UserTypes.Admin)
            return res
                .sendStatus(403);

        return next();
    }
    catch (e) {
        return res
            .sendStatus(500);
    }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
exports.checkIssueAuthor = async function (req, res, next) {
    try {
        let {user_role, user_id, issue_id} = res.locals;
        let issue = await issuesService.findIssueById(issue_id, {author: 1});

        if (user_role === UserTypes.Admin)
            return next();

        if (!issue || issue['author']['_doc'].id !== user_id) {
            return res
                .sendStatus(403);
        }

        return next();
    }
    catch (e) {
        if (e.code === '40001' || e.code === '40002') {
            return res
                .sendStatus(403);
        }

        return res
            .sendStatus(500);
    }
}