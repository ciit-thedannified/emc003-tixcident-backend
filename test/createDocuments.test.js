const {describe, expect, test, beforeEach, afterEach} = require("@jest/globals");
const {Authentication} = require('../src/firebase/firebase.config')
const {signInWithEmailAndPassword, onIdTokenChanged, signOut} = require('firebase/auth');
const axios = require("axios");
const {FEEDBACK_CREATE_SCHEMA, ISSUE_CREATE_SCHEMA} = require("../utils/helpers");
const {IssueTypes} = require("../utils/enums");

describe('Testing feedbacks model', () => {

    let user;
    let id;
    let token;
    let sub;
    let axiosInstance;

    beforeAll(async () => {
        user = await signInWithEmailAndPassword(Authentication,
            "kescolar@example.com",
            "kojey1234");

        axiosInstance = axios.create({
            baseURL: "http://localhost:3000/api/v1/",
        });

        sub = onIdTokenChanged(Authentication, async user => {
            token = await user.getIdToken();
            id = user.uid;
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
        });
    });

    afterAll(async () => {
        if (sub) {
            sub.unsubscribe();
        }

        await signOut(Authentication);
    });

    it('should be able to create feedback as a user', async () => {
        let payload = {
            title: "Impressive TIXCIDENT!",
            message: "Good job, TIXCIDENT Developers!",
            rating: 5,
        }

        let data = FEEDBACK_CREATE_SCHEMA.validate(payload);

        expect(data.error).toBeUndefined();

        let result = await axiosInstance.post("/feedbacks", data.value);

        expect(result.status).toBe(201);
    });

    it ('should be able to create an issue as a user', async () => {
        let payload = {
            title: "She cheated on me!!!",
            type: IssueTypes.Support,
            description: "She cheated, and I am in need of a emotional support right now.",
            tags: ['raving', 'crying', 'emotional', 'all over the place', 'screaming'],
        };

        let data = ISSUE_CREATE_SCHEMA.validate(payload);

        expect(data.error).toBeUndefined();

        let result = await axiosInstance.post('/issues', data.value);

        expect(result.status).toBe(201);
    });
});