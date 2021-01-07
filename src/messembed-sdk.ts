import axios, { AxiosInstance } from 'axios';
import { PaginatedChats } from './interfaces/paginated-chats.interface';
import {
  MessembedUserCreds,
  MessembedExtSerCreds,
} from './interfaces/creds.interface';
import * as _ from 'lodash';
import { Chat } from './interfaces/chat.interface';
import { PersonalChat } from './interfaces/personal-chat.interface';
import { CreateChatData } from './interfaces/create-chat-data.interface';
import { CreateUserData } from './interfaces/create-user-data.interface';
import { User } from './interfaces/user.interface';
import { CreateMessageData } from './interfaces/create-message-data.interface';
import { Message } from './interfaces/message.interface';
import { FindMessagesResult } from './interfaces/find-messages-result.interface';
import { FindMessagesData } from './interfaces/find-messages-data.interface';
import { AccessToken } from './interfaces/access-token.interface';

const DATE_FIELDS = ['createdAt', 'updatedAt', 'deletedAt'] as const;
const MESSAGE_DATE_FIELDS = [...DATE_FIELDS, 'readAt'] as const;

export class MessembedSDK {
  protected axios: AxiosInstance;

  constructor(baseURL: string) {
    this.axios = axios.create({ baseURL });
  }

  async createAccessToken(
    userId: string | number,
    creds: MessembedExtSerCreds | string,
  ): Promise<AccessToken> {
    const { data } = await this.axios.post<AccessToken>(
      `users/${userId}/access-tokens`,
      undefined,
      this.getAuthOptions(creds),
    );

    return data;
  }

  async getAllChats(
    creds: MessembedExtSerCreds | string,
  ): Promise<PaginatedChats> {
    const { data } = await this.axios.get<PaginatedChats>(
      'chats',
      this.getAuthOptions(creds),
    );

    const result = {
      ...data,
      data: this.parseDatesOfObjects(data.data, DATE_FIELDS),
    };

    return result;
  }

  async getChat(
    chatId: number | string,
    creds: MessembedExtSerCreds | string,
  ): Promise<Chat> {
    const { data } = await this.axios.get(
      `chats/${chatId}`,
      this.getAuthOptions(creds),
    );

    return this.parseDatesOfObject(data, DATE_FIELDS);
  }

  async getPersonalChats(
    creds: MessembedUserCreds | string,
  ): Promise<PersonalChat[]> {
    const { data } = await this.axios.get<PersonalChat[]>(
      `user/personal-chats`,
      this.getAuthOptions(creds),
    );

    return this.parseDatesOfObjects(data, DATE_FIELDS);
  }

  async createChat(
    createData: CreateChatData,
    creds: MessembedExtSerCreds | string,
  ): Promise<Chat> {
    const { data } = await this.axios.post(
      'chats',
      createData,
      this.getAuthOptions(creds),
    );

    return this.parseDatesOfObject<any, Chat>(data, DATE_FIELDS);
  }

  async createUser(
    createData: CreateUserData,
    creds: MessembedExtSerCreds | string,
  ): Promise<User> {
    const { data } = await this.axios.post(
      'users',
      createData,
      this.getAuthOptions(creds),
    );

    return this.parseDatesOfObject<any, User>(data, DATE_FIELDS);
  }

  async getMe(creds: MessembedUserCreds | string): Promise<User> {
    const { data } = await this.axios.get(`user`, this.getAuthOptions(creds));

    return this.parseDatesOfObject<any, User>(data, DATE_FIELDS);
  }

  async createMessage(
    createData: CreateMessageData,
    creds: MessembedUserCreds | string,
  ): Promise<Message> {
    const { chatId, ...requestBody } = createData;

    const { data } = await this.axios.post(
      `chats/${chatId}/messages`,
      requestBody,
      this.getAuthOptions(creds),
    );

    return this.parseDatesOfObject<any, Message>(data, MESSAGE_DATE_FIELDS);
  }

  async findMessages(
    findData: FindMessagesData,
    creds: MessembedUserCreds | MessembedExtSerCreds | string,
  ): Promise<FindMessagesResult> {
    const { chatId, ...queryParams } = findData;

    const { data } = await this.axios.get(`chats/${chatId}/messages`, {
      ...this.getAuthOptions(creds),
      params: queryParams,
    });

    return {
      ...data,
      messages: this.parseDatesOfObjects<any, Message>(
        data.messages,
        MESSAGE_DATE_FIELDS,
      ),
    };
  }

  async getUser(userId: string): Promise<User> {
    const { data } = await this.axios.get(`users/${userId}`);

    return data;
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

  protected getAuthOptions(
    creds: MessembedUserCreds | MessembedExtSerCreds | string,
  ): { auth?: any; headers: any } {
    const authOptions = {
      auth: undefined,
      headers: {} as Record<string, string>,
    };

    if (typeof creds === 'string') {
      authOptions.headers.authorization = creds;
    } else if ('password' in creds) {
      authOptions.auth = {
        username: 'external-service',
        password: creds.password,
      };
    } else {
      authOptions.headers.authorization = `Bearer ${creds.accessToken}`;
    }

    return authOptions;
  }
}
