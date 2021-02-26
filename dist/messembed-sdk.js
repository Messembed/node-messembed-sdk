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
const socket_io_client_1 = require("socket.io-client");
const events_1 = require("events");
const DATE_FIELDS = ['createdAt', 'updatedAt', 'deletedAt'];
const MESSAGE_DATE_FIELDS = [...DATE_FIELDS, 'readAt'];
class MessembedSDK {
    constructor(params) {
        this.eventEmitter = new events_1.EventEmitter();
        this.params = params;
        this.axios = axios_1.default.create({
            baseURL: params.baseUrl,
            headers: {
                authorization: `Bearer ${params.accessToken}`,
            },
        });
        this.initSocketIo();
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
    async sendMessageOverWS(params) {
        await this.untilSocketConnected();
        this.socket.emit('send_message', {
            content: params.content,
            chatId: params.chatId,
        });
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
    initSocketIo() {
        const messembedUrl = new URL(this.params.baseUrl);
        this.socket = socket_io_client_1.default(messembedUrl.origin, {
            path: messembedUrl.pathname === '/' ? '/socket.io' : messembedUrl.pathname + '/socket.io',
            query: {
                token: this.params.accessToken,
            },
        });
        this.socket.on('connect', () => {
            console.log('Socket connected', this.socket);
        });
        this.socket.on('new_update', (update) => {
            if (update.type === 'new_message') {
                this.eventEmitter.emit('new_message', update.message);
            }
            else if (update.type === 'new_chat') {
                this.eventEmitter.emit('new_chat', update.chat);
            }
        });
        this.socket.on('writing', (writing) => {
            const existingWritingIndicator = this.chatsWritingIndicators[writing.chatId];
            if (existingWritingIndicator && existingWritingIndicator.clearWritingTimeout) {
                clearTimeout(existingWritingIndicator.clearWritingTimeout);
                existingWritingIndicator.clearWritingTimeout = null;
            }
            else {
                this.chatsWritingIndicators[writing.chatId] = {
                    writing: true,
                    clearWritingTimeout: null,
                };
            }
            this.chatsWritingIndicators[writing.chatId].writing = true;
            this.chatsWritingIndicators[writing.chatId].clearWritingTimeout = setTimeout(() => {
                this.chatsWritingIndicators[writing.chatId].writing = false;
                this.chatsWritingIndicators[writing.chatId].clearWritingTimeout = null;
                this.eventEmitter.emit('writing_end', writing.chatId);
            }, 1500);
            this.eventEmitter.emit('writing', writing.chatId);
        });
    }
    onNewMessage(cb) {
        this.eventEmitter.on('new_message', cb);
        return this;
    }
    onNewChat(cb) {
        this.eventEmitter.on('new_chat', cb);
        return this;
    }
    onWriting(cb) {
        this.eventEmitter.on('writing', cb);
        return this;
    }
    onWritingEnd(cb) {
        this.eventEmitter.on('writing_end', cb);
        return this;
    }
    sendWritingIndicator(chatId) {
        this.socket.emit('send_writing', { chatId: chatId });
    }
    async untilSocketConnected() {
        if (this.socket.connected) {
            return Promise.resolve();
        }
        return new Promise((resolve) => {
            this.socket.on('connect', () => resolve());
        });
    }
}
exports.MessembedSDK = MessembedSDK;
//# sourceMappingURL=messembed-sdk.js.map