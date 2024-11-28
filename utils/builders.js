exports.filterBuilder = function () {
    const obj = {};

    return {
        appendField: function (key, value, transform) {
            if (typeof key !== "string") {
                throw new Error("Key must be a string");
            }

            // Ignore undefined and null initial values
            if (value === undefined || value === null) {
                return this;
            }

            // Apply the transform function if provided, otherwise use the original value
            const finalValue = typeof transform === "function" ? transform(value) : value;

            // Ignore undefined and null values
            if (finalValue !== undefined && finalValue !== null) {
                obj[key] = finalValue;
            }
            return this; // Return the builder for chaining
        },
        build: function () {
            return { ...obj }; // Return a copy of the object to prevent modification
        }
    };
}

exports.regexpBuilder = function (pattern) {
    return { $regex: pattern };
}

exports.dateRangeBuilder = function (fromDate = null, toDate = null) {
    let dateRange = {}

    if (fromDate) Object.assign(dateRange, {$gte: new Date(fromDate)});
    if (toDate) Object.assign(dateRange, {$lte: new Date(toDate)});

    return dateRange;
}