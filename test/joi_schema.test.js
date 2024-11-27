const {describe, expect} = require("@jest/globals");
const {USER_CREATE_SCHEMA, ISSUE_SEARCH_SCHEMA, ISSUE_BULK_UPDATE_SCHEMA} = require("../utils/helpers");
const {PriorityTypes, StatusTypes} = require("../utils/enums");

describe('Testing USER_CREATE_SCHEMA Implementation', () => {

    it('should accept inputs of required fields', () => {
        let payload = {
            username: 'thedannified',
            email: 'thedannified@outlook.ph'
        };

        let result = USER_CREATE_SCHEMA.validate(payload);

        // Asserting that the schema can accept only the required fields.
        expect(result.error).toBeUndefined();
    });

    it('should not accept any invalid fields', () => {
        let payload = {
            username: 'kojiescolar',
            email: 'koji@escolar.ph',
            something: true,
        }

        let result = USER_CREATE_SCHEMA.validate(payload);

        // Asserting that the schema does not accept extraneous data.
        expect(result.error).not.toBeUndefined();
    });

    it('should accept at least one optional field', () => {
        // trying with displayName field
        let payload_1 = {
            username: 'jcarlo130',
            email: 'jcarlo130@example.com',
            displayName: 'calipasti'
        }

        let result_1 = USER_CREATE_SCHEMA.validate(payload_1);

        // Asserting that displayName field is accepted, albeit optional.
        expect(result_1.error).toBeUndefined();

        // trying by providing a custom user id
        let payload_2 = {
            id: 'ky0k0',
            username: 'prgkyoko',
            email: 'kyoko@prg.com.ph',
        }

        let result_2 = USER_CREATE_SCHEMA.validate(payload_2);

        // Asserting that custom ID is accepted.
        expect(result_2.error).toBeUndefined();
    });

    it('should accept inputs with all fields', () => {
        let payload = {
            id: 'ajmc1234',
            username: 'ajmcalalang',
            email: 'ajmc@example.com',
            displayName: 'aeyjay',
        }

        let result = USER_CREATE_SCHEMA.validate(payload);

        expect(result.error).toBeUndefined();
    });

});

describe('Testing ISSUE_SEARCH_SCHEMA Implementation', () => {

    it('should return a null object if validating a null object', () => {
        let payload = null;

        let result = ISSUE_SEARCH_SCHEMA.validate(payload);

        expect(result.value).toBeNull();
    });

});

describe('Testing ISSUE_BULK_UPDATE_SCHEMA', () => {

    it('should return an error when the payload does not contain an update_data', () => {
        let payload = {
            issue_ids: ['1', '2', '3'],
        };

        let result = ISSUE_BULK_UPDATE_SCHEMA.validate(payload);

        expect(result.error).not.toBeUndefined();
    });

    it('should return a value if all fields exist.', () => {
        let payload = {
            issue_ids: ['1', '2', '3'],
            update_data: {
                priority: PriorityTypes.High
            }
        };

        let result = ISSUE_BULK_UPDATE_SCHEMA.validate(payload);

        expect(result.error).toBeUndefined();
        console.log(result.value);
    });

    it('should return an error if an unknown update_data field exists.', () => {
        let payload = {
            issue_ids: ['1', '2', '3'],
            update_data: {
                priority: PriorityTypes.High,
                something: true,
            }
        };

        let result = ISSUE_BULK_UPDATE_SCHEMA.validate(payload);

        expect(result.error).not.toBeUndefined();
        console.log(result.error);
    });

    it('should return a value if all fields in update_data schema exist.', () => {
        let payload = {
            issue_ids: ['1', '2', '3'],
            update_data: {
                staff: 'someUserId',
                priority: PriorityTypes.High,
                tags: ['hello', 'world'],
                status: StatusTypes.InProgress,
            }
        };

        let result = ISSUE_BULK_UPDATE_SCHEMA.validate(payload);

        expect(result.error).toBeUndefined();
        console.log(result.value);
    });

})