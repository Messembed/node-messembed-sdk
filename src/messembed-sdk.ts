import axios, { AxiosInstance } from 'axios';
import * as _ from 'lodash';
import { PersonalChat } from './interfaces/personal-chat.interface';
import { User } from './interfaces/user.interface';
import { CreateMessageData } from './interfaces/create-message-data.interface';
import { Message } from './interfaces/message.interface';
import { FindMessagesResult } from './interfaces/find-messages-result.interface';
import { FindMessagesData } from './interfaces/find-messages-data.interface';
import { MessembedSDKOptions } from './interfaces/messembed-sdk-options.interface';
import { Update } from './interfaces';

const DATE_FIELDS = ['createdAt', 'updatedAt', 'deletedAt'] as const;
const MESSAGE_DATE_FIELDS = [...DATE_FIELDS, 'readAt'] as const;

export class MessembedSDK {
  protected axios: AxiosInstance;

  constructor(options: MessembedSDKOptions) {
    this.axios = axios.create({
      baseURL: options.baseUrl,
      headers: {
        authorization: `Bearer ${options.accessToken}`,
      },
    });
  }

  async getPersonalChats(): Promise<PersonalChat[]> {
    const { data } = await this.axios.get<PersonalChat[]>(
      'user/personal-chats',
    );

    return this.parseDatesOfObjects(data, DATE_FIELDS);
  }

  async getMe(): Promise<User> {
    const { data } = await this.axios.get(`user`);

    return this.parseDatesOfObject<any, User>(data, DATE_FIELDS);
  }

  async createMessage(createData: CreateMessageData): Promise<Message> {
    const { chatId, ...requestBody } = createData;

    const { data } = await this.axios.post(
      `chats/${chatId}/messages`,
      requestBody,
    );

    return this.parseDatesOfObject<any, Message>(data, MESSAGE_DATE_FIELDS);
  }

  async findMessages(findData: FindMessagesData): Promise<FindMessagesResult> {
    const { chatId, ...queryParams } = findData;

    const { data } = await this.axios.get(`chats/${chatId}/messages`, {
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

  async getUpdates(
    creationDateOfLastFetchedUpdate: Date | string,
  ): Promise<Update[]> {
    const updatesResponse = await this.axios.get<Update[]>('updates', {
      params: {
        creationDateOfLastFetchedUpdate:
          typeof creationDateOfLastFetchedUpdate === 'string'
            ? creationDateOfLastFetchedUpdate
            : creationDateOfLastFetchedUpdate.toISOString(),
      },
    });

    return updatesResponse.data;
  }

  async createChat(companionId: string): Promise<PersonalChat> {
    const creationResponse = await this.axios.post<PersonalChat>(
      'personal/chats',
      {
        companionId,
      },
    );

    return creationResponse.data;
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
