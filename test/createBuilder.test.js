const {describe, expect, test} = require("@jest/globals");
const {filterBuilder, regexpBuilder, dateRangeBuilder} = require("../utils/builders");
const {ISSUE_SEARCH_SCHEMA} = require("../utils/helpers");


describe('Testing filterBuilder', () => {
    it('should produce an empty object', () => {
        let j = {}

        let __query = filterBuilder()
            .appendField("author", j?.author)
            .appendField("staffs", j?.staffs,
                (value) => value !== undefined && value.length > 0 ? { $in: j?.staffs } : undefined)
            .appendField("priority", j?.priority)
            .appendField("tags", j?.tags,
                (value) => value !== undefined && value.length > 0
                    ? { $in: j?.tags } : undefined)
            .appendField("status", j?.status)
            .appendField("title", j?.title,
                (value) => value !== undefined ? new RegExp("^" + j.title) : undefined)
            .build();

        expect(__query).toEqual({});
    });

    it('should still produce an object when fields are undefined', () => {
        let j = {
            author: undefined,
            staffs: [],
            priority: undefined,
            tags: undefined,
            status: undefined,
            title: undefined,
        }

        let __query = filterBuilder()
            .appendField("author", j?.author)
            .appendField("staffs", j?.staffs,
                (value) => value !== undefined && value.length > 0 ? { $in: j?.staffs } : undefined)
            .appendField("priority", j?.priority)
            .appendField("tags", j?.tags,
                (value) => value !== undefined && value.length > 0
                    ? { $in: j?.tags } : undefined)
            .appendField("status", j?.status)
            .appendField("title", j?.title,
                (value) => value !== undefined ? new RegExp("^" + value) : undefined)
            .build();

        expect(__query).toEqual({});

        console.log(__query)
    });

    test('when passing a title, return a regexp', () => {
        let j = {
            title: "hello world",
        };

        let __query = filterBuilder()
            .appendField("title", j?.title, (value) => new RegExp(`/^${value}/`))
            .build();

        expect(__query.title).toBeInstanceOf(RegExp);
    });

    test('building issues search query with fromDate and toDate, assigned to createdAt', () => {
        let payload = {
            fromDate: Date.now(),
            toDate: Date.now(),
        }

        let filter = ISSUE_SEARCH_SCHEMA.validate(payload);

        expect(filter.error).toBeUndefined();

        let _filter = filter.value

        let query = filterBuilder()

        if (_filter?.fromDate !== undefined || _filter?.toDate !== undefined) {
            query
                .appendField("createdAt", {}, value => {
                    if (_filter?.fromDate !== undefined) Object.assign(value, {$gte: _filter?.fromDate});
                    if (_filter?.toDate !== undefined) Object.assign(value, {$lte: _filter?.toDate});

                    return value;
                });
        }

        query = query.build();

        console.log(query.createdAt);
    })

})

describe('testing dateRangeBuilder', () => {
    test('inputting fromDate only', () => {
        let payload = {
            fromDate: '11-20-2024'
        }

        let dateRange = dateRangeBuilder(payload.fromDate);

        expect(dateRange.$gte.valueOf()).toBeLessThanOrEqual(Date.now().valueOf());
    })
});