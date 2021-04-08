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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessembedAdminSDK = void 0;
const axios_1 = __importDefault(require("axios"));
const _ = __importStar(require("lodash"));
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
    async getChatByCompanionsIds(companionsIds) {
        if (companionsIds.length !== 2) {
            throw new TypeError('Argument companionsIds should be an array with 2 IDs');
        }
        const { data } = await this.axios.get(`admin-api/chats/${companionsIds.join(':')}`);
        return this.parseDatesOfObject(data, DATE_FIELDS);
    }
    async createChat(createData) {
        const { data } = await this.axios.post('admin-api/chats', createData);
        return this.parseDatesOfObject(data, DATE_FIELDS);
    }
    async editChat(params) {
        const { data } = await this.axios.patch('admin-api/chats/' + params.chatId, _.omit(params, 'chatId'));
        return this.parseDatesOfObject(data, DATE_FIELDS);
    }
    async createUser(createData) {
        const { data } = await this.axios.post('admin-api/users', createData);
        return this.parseDatesOfObject(data, DATE_FIELDS);
    }
    async editUser(params) {
        const { data } = await this.axios.patch('admin-api/users/' + params.userId, _.omit(params, 'userId'));
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