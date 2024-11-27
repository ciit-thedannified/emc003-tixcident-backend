const FirebaseAdmin = require("../../../../firebase/firebase-admin.js");

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<*>}
 */
exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = await FirebaseAdmin.auth().verifyIdToken(token);

        if (decodedToken) {
            res.locals.id = decodedToken.uid;
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
            .status(500)
            .json({
                message: 'Internal Server Error.'
            });
    }
}