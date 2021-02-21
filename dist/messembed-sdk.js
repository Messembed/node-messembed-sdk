"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessembedSDK = void 0;
const axios_1 = require("axios");
const _ = require("lodash");
const DATE_FIELDS = ['createdAt', 'updatedAt', 'deletedAt'];
const MESSAGE_DATE_FIELDS = [...DATE_FIELDS, 'readAt'];
class MessembedSDK {
    constructor(options) {
        this.axios = axios_1.default.create({
            baseURL: options.baseUrl,
            headers: {
                authorization: `Bearer ${options.accessToken}`,
            },
        });
    }
    async getPersonalChats() {
        const { data } = await this.axios.get('user/personal-chats');
        return this.parseDatesOfObjects(data, DATE_FIELDS);
    }
    async getMe() {
        const { data } = await this.axios.get(`user`);
        return this.parseDatesOfObject(data, DATE_FIELDS);
    }
    async createMessage(createData) {
        const { chatId } = createData, requestBody = __rest(createData, ["chatId"]);
        const { data } = await this.axios.post(`chats/${chatId}/messages`, requestBody);
        return this.parseDatesOfObject(data, MESSAGE_DATE_FIELDS);
    }
    async findMessages(findData) {
        const { chatId } = findData, queryParams = __rest(findData, ["chatId"]);
        const { data } = await this.axios.get(`chats/${chatId}/messages`, {
            params: queryParams,
        });
        return Object.assign(Object.assign({}, data), { messages: this.parseDatesOfObjects(data.messages, MESSAGE_DATE_FIELDS) });
    }
    async getUser(userId) {
        const { data } = await this.axios.get(`users/${userId}`);
        return data;
    }
    async getUpdates(creationDateOfLastFetchedUpdate) {
        const updatesResponse = await this.axios.get('updates', {
            params: {
                creationDateOfLastFetchedUpdate: typeof creationDateOfLastFetchedUpdate === 'string'
                    ? creationDateOfLastFetchedUpdate
                    : creationDateOfLastFetchedUpdate.toISOString(),
            },
        });
        return updatesResponse.data;
    }
    async createChat(companionId) {
        const creationResponse = await this.axios.post('user/personal-chats', {
            companionId,
        });
        return creationResponse.data;
    }
    async readChat(chatId) {
        await this.axios.post(`user/personal-chats/${chatId}/read-status`);
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
exports.MessembedSDK = MessembedSDK;
//# sourceMappingURL=messembed-sdk.js.map