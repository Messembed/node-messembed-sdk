"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessembedSDK = void 0;
const axios_1 = __importDefault(require("axios"));
const _ = __importStar(require("lodash"));
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const events_1 = require("events");
const messembed_error_1 = require("./messembed-error");
const DATE_FIELDS = ['createdAt', 'updatedAt', 'deletedAt'];
const MESSAGE_DATE_FIELDS = [...DATE_FIELDS, 'readAt'];
class MessembedSDK {
    constructor(params) {
        this.eventEmitter = new events_1.EventEmitter();
        this.chatsWritingIndicators = {};
        this.params = params;
        this.axios = axios_1.default.create({
            baseURL: params.baseUrl,
            headers: {
                authorization: `Bearer ${params.accessToken}`,
            },
        });
        this.axios.interceptors.response.use(undefined, (error) => {
            if (this.isAxiosError(error) && error.response.data) {
                throw new messembed_error_1.MessembedError(`${error.response.status} ${error.response.statusText}: ` +
                    `${error.response.data.code} ${error.response.data.message}`, error.response.data.code, error.response.data);
            }
            throw error;
        });
        this.initSocketIo();
    }
    async listPersonalChats(params) {
        const { data } = await this.axios.get('user/personal-chats', { params });
        return this.parseDatesOfObjects(data, DATE_FIELDS);
    }
    async getMe() {
        const { data } = await this.axios.get(`user`);
        return this.parseDatesOfObject(data, DATE_FIELDS);
    }
    async createMessage(params) {
        const { chatId } = params, requestBody = __rest(params, ["chatId"]);
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
    async listMessages(params) {
        const { chatId } = params, queryParams = __rest(params, ["chatId"]);
        const { data } = await this.axios.get(`chats/${chatId}/messages`, {
            params: queryParams,
        });
        return Object.assign(Object.assign({}, data), { messages: this.parseDatesOfObjects(data.messages, MESSAGE_DATE_FIELDS) });
    }
    async listMessagesWithAttachments(params) {
        const { data } = await this.axios.get(`chats/${params.chatId}/messages-with-attachments`);
        return this.parseDatesOfObjects(data, MESSAGE_DATE_FIELDS);
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
            if (date) {
                _.set(obj, dateField, new Date(date));
            }
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
    isAxiosError(error) {
        return !!(error && error.isAxiosError);
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