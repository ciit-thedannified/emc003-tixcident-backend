function filterBuilder() {
    const obj = {};

    return {
        appendField: function (key, value, transform) {
            if (typeof key !== "string") {
                throw new Error("Key must be a string");
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

function regexpBuilder(pattern) {
    return { $regex: pattern };
}

module.exports = {
    filterBuilder,
    regexpBuilder,
}