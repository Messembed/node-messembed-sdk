import { MessembedAdminSDKParams } from './interfaces/messembed-admin-sdk-params.interface';
import axios, { AxiosInstance } from 'axios';
import { AccessToken } from './interfaces/access-token.interface';
import { PaginatedChats } from './interfaces/paginated-chats.interface';
import * as _ from 'lodash';
import { Chat } from './interfaces/chat.interface';
import { CreateChatParams } from './interfaces/create-chat-params.interface';
import { CreateUserParams } from './interfaces/create-user-params.interface';
import { User } from './interfaces/user.interface';
import { ListMessagesParams, ListMessagesResult } from './interfaces';
import { EditUserParams } from './interfaces/edit-user-params.interface';
import { EditChatParams } from './interfaces/edit-chat-params.interface';

const DATE_FIELDS = ['createdAt', 'updatedAt', 'deletedAt'] as const;

export class MessembedAdminSDK {
  protected axios: AxiosInstance;
  constructor(params: MessembedAdminSDKParams) {
    this.axios = axios.create({
      baseURL: params.baseUrl,
      auth: {
        username: params.username,
        password: params.password,
      },
    });
  }

  async getUser(userId: string): Promise<User> {
    const { data } = await this.axios.get(`users/${userId}`);

    return data;
  }

  async createAccessToken(userId: string | number): Promise<AccessToken> {
    const { data } = await this.axios.post<AccessToken>(
      `admin-api/users/${userId}/access-tokens`,
    );

    return data;
  }

  async getAllChats(): Promise<PaginatedChats> {
    const { data } = await this.axios.get<PaginatedChats>('admin-api/chats');

    const result = {
      ...data,
      data: this.parseDatesOfObjects(data.data, DATE_FIELDS),
    };

    return result;
  }

  async getChat(chatId: string): Promise<Chat> {
    const { data } = await this.axios.get(`admin-api/chats/${chatId}`);

    return this.parseDatesOfObject(data, DATE_FIELDS);
  }

  async getChatByCompanionsIds(companionsIds: string[]): Promise<Chat>  {
    if(companionsIds.length !== 2) {
      throw new TypeError('Argument companionsIds should be an array with 2 IDs')
    }

    const { data } = await this.axios.get(`admin-api/chats/${companionsIds.join(':')}`);

    return this.parseDatesOfObject(data, DATE_FIELDS);
  }

  async createChat(params: CreateChatParams): Promise<Chat> {
    const { data } = await this.axios.post('admin-api/chats', params);

    return this.parseDatesOfObject<any, Chat>(data, DATE_FIELDS);
  }

  async editChat(params: EditChatParams): Promise<Chat> {
    const { data } = await this.axios.patch('admin-api/chats/' + params.chatId, _.omit(params, 'chatId'));

    return this.parseDatesOfObject<any, Chat>(data, DATE_FIELDS);
  }

  async createUser(params: CreateUserParams): Promise<User> {
    const { data } = await this.axios.post('admin-api/users', params);

    return this.parseDatesOfObject<any, User>(data, DATE_FIELDS);
  }

  async editUser(params: EditUserParams): Promise<User> {
    const { data } = await this.axios.patch('admin-api/users/' + params.userId, _.omit(params, 'userId'))

    return this.parseDatesOfObject<any, User>(data, DATE_FIELDS);
  }

  async listMessages(
    params: Omit<ListMessagesParams, 'chatId'>,
  ): Promise<ListMessagesResult> {
    const response = await this.axios.get<ListMessagesResult>(
      'admin-api/messages',
      { params },
    );
    return response.data;
  }

  protected parseDatesOfObjects<T extends Record<string, any>, R = T>(
    objects: T[],
    dateFields: readonly string[],
  ): R[] {
    objects.forEach((obj) => {
      this.parseDatesOfObject<T, R>(obj, dateFields);
    });

    return objects as R[];
  }

  protected parseDatesOfObject<T extends Record<string, any>, R = T>(
    obj: T,
    dateFields: readonly string[],
  ): R {
    dateFields.forEach((dateField) => {
      const date = _.get(obj, dateField);
      _.set(obj, dateField, date && new Date(date));
    });

    return obj as R;
  }
}
