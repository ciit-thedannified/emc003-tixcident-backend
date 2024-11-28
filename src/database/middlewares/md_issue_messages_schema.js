const {onDocumentWithAuthorCreated} = require("./md_abstract_schema");

exports.onIssueMessageCreated = onDocumentWithAuthorCreated;

exports.onIssueMessageFind = async function (next) {
    this
        .select('-__v -updatedAt')
        .populate({
            path: "author",
            select: "-createdAt -updatedAt -__v -email -_id",
            options: {}
        });

    return next();
}