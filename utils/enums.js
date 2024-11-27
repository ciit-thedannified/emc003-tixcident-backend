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
    Assigned: "ASSIGNED",
    InProgress: "IN_PROGRESS",
    Resolved: "RESOLVED",
    Invalid: "INVALID",
});

const IssueTypes = Object.freeze({
    None: "NONE",
    Bug: "BUG",
    Feature: "FEATURE_REQUEST",
    Help: "HELP",
    Incident: "INCIDENT",
    ServiceRequest: "SERVICE_REQUEST",
    Support: "SUPPORT",
});

const FeedbackTypes = Object.freeze({
    CustomerService: "CUSTOMER_SERVICE",
    ProductReview: "PRODUCT_REVIEW",
    ApplicationReview: "APPLICATION_REVIEW",
    Others: "OTHERS",
})

const USER_TYPES = Object.values(UserTypes);
const PRIORITY_TYPES = Object.values(PriorityTypes);
const STATUS_TYPES = Object.values(StatusTypes);
const ISSUE_TYPES = Object.values(IssueTypes);
const FEEDBACK_TYPES = Object.values(FeedbackTypes);

module.exports = {
    UserTypes,
    PriorityTypes,
    StatusTypes,
    IssueTypes,
    FeedbackTypes,
    USER_TYPES,
    PRIORITY_TYPES,
    STATUS_TYPES,
    ISSUE_TYPES,
    FEEDBACK_TYPES,
}
