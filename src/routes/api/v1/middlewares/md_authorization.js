const FirebaseAdmin = require("../../../../firebase/firebase-admin.js");
const usersService = require("../services/users_service");
const {UserTypes} = require("../../../../../utils/enums");

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<*>}
 */
exports.verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        let token;

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
        if (e['errorInfo'].code === 'auth/argument-error')
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

exports.checkAdminRole = async function (req, res, next) {
    try {
        let {user_role} = res.locals;

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