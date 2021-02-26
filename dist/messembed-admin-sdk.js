"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessembedAdminSDK = void 0;
const axios_1 = require("axios");
const _ = require("lodash");
const DATE_FIELDS = ['createdAt', 'updatedAt', 'deletedAt'];
class MessembedAdminSDK {
    constructor(options) {
        this.axios = axios_1.default.create({
            baseURL: options.baseUrl,
            auth: {
                username: options.username,
                password: options.password,
            },
        });
    }
    async getUser(userId) {
        const { data } = await this.axios.get(`users/${userId}`);
        return data;
    }
    async createAccessToken(userId) {
        const { data } = await this.axios.post(`admin-api/users/${userId}/access-tokens`);
        return data;
    }
    async getAllChats() {
        const { data } = await this.axios.get('admin-api/chats');
        const result = Object.assign(Object.assign({}, data), { data: this.parseDatesOfObjects(data.data, DATE_FIELDS) });
        return result;
    }
    async getChat(chatId) {
        const { data } = await this.axios.get(`admin-api/chats/${chatId}`);
        return this.parseDatesOfObject(data, DATE_FIELDS);
    }
    async createChat(createData) {
        const { data } = await this.axios.post('admin-api/chats', createData);
        return this.parseDatesOfObject(data, DATE_FIELDS);
    }
    async createUser(createData) {
        const { data } = await this.axios.post('admin-api/users', createData);
        return this.parseDatesOfObject(data, DATE_FIELDS);
    }
    async getMessages(params) {
        const response = await this.axios.get('admin-api/messages', { params });
        return response.data;
    }
    parseDatesOfObjects(objects, dateFields) {
        objects.forEach((obj) => {
            this.parseDatesOfObject(obj, dateFields);
        });
        return objects;
    }
    parseDatesOfObject(obj, dateFields) {
        dateFields.forEach((dateField) => {
            const date = _.get(obj, dateField);
            _.set(obj, dateField, date && new Date(date));
        });
        return obj;
    }
}
exports.MessembedAdminSDK = MessembedAdminSDK;
//# sourceMappingURL=messembed-admin-sdk.js.map