/// PRE HOOKS

/**
 * @param {NextFunction} next
 * @returns {Promise<*>}
 */
exports.onFeedbackFind = async function (next) {
    this
        .where({isDeleted: false})
        .select('-__v -isDeleted -deletedAt')
        .populate({
            path: 'author',
            model: 'users',
            localField: 'author',
            foreignField: 'id',
            select: '-createdAt -updatedAt -__v -email -_id',
        });

    return next();
}