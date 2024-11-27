const UserTypes = Object.freeze({
    User: "USER",
    Admin: "ADMIN",
});

const PriorityTypes = Object.freeze({
    None: "NONE",
    Low: "LOW",
    Medium: "MEDIUM",
    High: "HIGH",
});

const StatusTypes = Object.freeze({
    Open: "OPEN",
    InProgress: "IN_PROGRESS",
    Resolved: "RESOLVED",
    Invalid: "INVALID",
});

const USER_TYPES = Object.values(UserTypes);
const PRIORITY_TYPES = Object.values(PriorityTypes);
const STATUS_TYPES = Object.values(StatusTypes);

module.exports = {
    UserTypes,
    PriorityTypes,
    StatusTypes,
    USER_TYPES,
    PRIORITY_TYPES,
    STATUS_TYPES
}
