class IssueNotFound extends Error {
    /**
     *
     * @param {string} message
     * @param {string} code
     */
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

module.exports = {
    IssueNotFound,
}