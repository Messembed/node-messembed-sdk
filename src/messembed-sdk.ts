import axios, { AxiosError, AxiosInstance } from 'axios';
import * as _ from 'lodash';
import { PersonalChat } from './interfaces/personal-chat.interface';
import { User } from './interfaces/user.interface';
import { CreateMessageParams } from './interfaces/create-message-params.interface';
import { Message } from './interfaces/message.interface';
import { ListMessagesResult } from './interfaces/list-messages-result.interface';
import { ListMessagesParams } from './interfaces/list-messages-params.interface';
import { MessembedSDKParams } from './interfaces/messembed-sdk-params.interface';
import { Update } from './interfaces';
import io, { Socket } from 'socket.io-client';
import { EventEmitter } from 'events';
import { ListPersonalChatsParams } from './interfaces/list-personal-chats-params.interface';
import { MessembedError } from './messembed-error';
import { GetUnreadChatsCountParams } from './interfaces/get-unread-chats-count-params.dto';

const DATE_FIELDS = ['createdAt', 'updatedAt', 'deletedAt'] as const;
const MESSAGE_DATE_FIELDS = [...DATE_FIELDS, 'readAt'] as const;

export class MessembedSDK {
  protected axios: AxiosInstance;
  protected params: MessembedSDKParams;
  protected socket: typeof Socket;
  protected eventEmitter = new EventEmitter();
  protected chatsWritingIndicators: {
    [chatId: string]: {
      writing: boolean;
      clearWritingTimeout?: any;
    };
  } = {};

  constructor(params: MessembedSDKParams) {
    this.params = params;
    this.axios = axios.create({
      baseURL: params.baseUrl,
      headers: {
        authorization: `Bearer ${params.accessToken}`,
      },
    });

    this.axios.interceptors.response.use(undefined, (error) => {
      if (this.isAxiosError(error) && error.response.data) {
        throw new MessembedError(
          `${error.response.status} ${error.response.statusText}: ` +
            `${error.response.data.code} ${error.response.data.message}`,
          error.response.data.code,
          error.response.data,
        );
      }

      throw error;
    });
    this.initSocketIo();
  }

  async listPersonalChats(params?: ListPersonalChatsParams): Promise<PersonalChat[]> {
    const { data } = await this.axios.get<PersonalChat[]>('user/personal-chats', { params });

    return this.parseDatesOfObjects(data, DATE_FIELDS);
  }

  async getUnreadChatsCount(params?: GetUnreadChatsCountParams): Promise<number> {
    const { data } = await this.axios.get<{ count: number }>('user/unread-personal-chats-count', { params });

    return data.count;
  }

  async getMe(): Promise<User> {
    const { data } = await this.axios.get(`user`);

    return this.parseDatesOfObject<any, User>(data, DATE_FIELDS);
  }

  async createMessage(params: CreateMessageParams): Promise<Message> {
    const { chatId, ...requestBody } = params;

    const { data } = await this.axios.post(`chats/${chatId}/messages`, requestBody);

    return this.parseDatesOfObject<any, Message>(data, MESSAGE_DATE_FIELDS);
  }

  async sendMessageOverWS(params: CreateMessageParams): Promise<void> {
    await this.untilSocketConnected();

    this.socket.emit('send_message', {
      content: params.content,
      chatId: params.chatId,
      attachments: params.attachments,
      externalMetadata: params.externalMetadata,
    });
  }

  async listMessages(params: ListMessagesParams): Promise<ListMessagesResult> {
    const { chatId, ...queryParams } = params;

    const { data } = await this.axios.get(`chats/${chatId}/messages`, {
      params: queryParams,
    });

    return {
      ...data,
      messages: this.parseDatesOfObjects<any, Message>(data.messages, MESSAGE_DATE_FIELDS),
    };
  }

  async listMessagesWithAttachments(params: { chatId: string }): Promise<Message[]> {
    const { data } = await this.axios.get(`chats/${params.chatId}/messages-with-attachments`);

    return this.parseDatesOfObjects<any, Message>(data, MESSAGE_DATE_FIELDS);
  }

  async getUser(userId: string): Promise<User> {
    const { data } = await this.axios.get(`users/${userId}`);

    return data;
  }

  async getUpdates(creationDateOfLastFetchedUpdate: Date | string): Promise<Update[]> {
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
    const creationResponse = await this.axios.post<PersonalChat>('user/personal-chats', {
      companionId,
    });

    return creationResponse.data;
  }

  async readChat(chatId: string): Promise<void> {
    await this.axios.post(`user/personal-chats/${chatId}/read-status`);
  }

  async clearChatHistory(chatId: string): Promise<void> {
    await this.axios.delete(`chats/${chatId}/messages`);
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

  protected parseDatesOfObject<T extends Record<string, any>, R = T>(obj: T, dateFields: readonly string[]): R {
    dateFields.forEach((dateField) => {
      const date = _.get(obj, dateField);

      if (date) {
        _.set(obj, dateField, new Date(date));
      }
    });

    return obj as R;
  }

  protected initSocketIo(): void {
    const messembedUrl = new URL(this.params.baseUrl);

    this.socket = io(messembedUrl.origin, {
      path: messembedUrl.pathname === '/' ? '/socket.io' : messembedUrl.pathname + '/socket.io',
      query: {
        token: this.params.accessToken,
      },
    });

    this.socket.on('connect', () => {
      console.log('Socket connected', this.socket);
    });

    this.socket.on('new_update', (update: Update) => {
      if (update.type === 'new_message') {
        this.eventEmitter.emit('new_message', update.message);
      } else if (update.type === 'new_chat') {
        this.eventEmitter.emit('new_chat', update.chat);
      }
    });

    this.socket.on('writing', (writing: { chatId: string }) => {
      const existingWritingIndicator = this.chatsWritingIndicators[writing.chatId];

      if (existingWritingIndicator && existingWritingIndicator.clearWritingTimeout) {
        clearTimeout(existingWritingIndicator.clearWritingTimeout);
        existingWritingIndicator.clearWritingTimeout = null;
      } else {
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

  protected isAxiosError(error: any): error is AxiosError {
    return !!(error && error.isAxiosError);
  }

  onNewMessage(cb: (message: Message) => any): this {
    this.eventEmitter.on('new_message', cb);
    return this;
  }

  onNewChat(cb: (chat: PersonalChat) => any): this {
    this.eventEmitter.on('new_chat', cb);
    return this;
  }

  onWriting(cb: (chatId: string) => any): this {
    this.eventEmitter.on('writing', cb);
    return this;
  }

  onWritingEnd(cb: (chatId: string) => any): this {
    this.eventEmitter.on('writing_end', cb);
    return this;
  }

  sendWritingIndicator(chatId: string): void {
    this.socket.emit('send_writing', { chatId: chatId });
  }

  close(): void {
    this.socket.close()
  }

  protected async untilSocketConnected(): Promise<void> {
    if (this.socket.connected) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.socket.on('connect', () => resolve());
    });
  }
}
