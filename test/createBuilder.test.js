const {describe, expect, test} = require("@jest/globals");
const {filterBuilder} = require("../utils/builders");


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

})