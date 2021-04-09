/// <reference types="node" />
import { AxiosInstance } from 'axios';
import { PersonalChat } from './interfaces/personal-chat.interface';
import { User } from './interfaces/user.interface';
import { CreateMessageParams } from './interfaces/create-message-params.interface';
import { Message } from './interfaces/message.interface';
import { ListMessagesResult } from './interfaces/list-messages-result.interface';
import { ListMessagesParams } from './interfaces/list-messages-params.interface';
import { MessembedSDKParams } from './interfaces/messembed-sdk-params.interface';
import { Update } from './interfaces';
import { Socket } from 'socket.io-client';
import { EventEmitter } from 'events';
import { ListPersonalChatsParams } from './interfaces/list-personal-chats-params.interface';
export declare class MessembedSDK {
    protected axios: AxiosInstance;
    protected params: MessembedSDKParams;
    protected socket: typeof Socket;
    protected eventEmitter: EventEmitter;
    protected chatsWritingIndicators: {
        [chatId: string]: {
            writing: boolean;
            clearWritingTimeout?: any;
        };
    };
    constructor(params: MessembedSDKParams);
    listPersonalChats(params?: ListPersonalChatsParams): Promise<PersonalChat[]>;
    getMe(): Promise<User>;
    createMessage(params: CreateMessageParams): Promise<Message>;
    sendMessageOverWS(params: {
        chatId: string;
        content: string;
    }): Promise<void>;
    listMessages(params: ListMessagesParams): Promise<ListMessagesResult>;
    getUser(userId: string): Promise<User>;
    getUpdates(creationDateOfLastFetchedUpdate: Date | string): Promise<Update[]>;
    createChat(companionId: string): Promise<PersonalChat>;
    readChat(chatId: string): Promise<void>;
    protected parseDatesOfObjects<T extends Record<string, any>, R = T>(objects: T[], dateFields: readonly string[]): R[];
    protected parseDatesOfObject<T extends Record<string, any>, R = T>(obj: T, dateFields: readonly string[]): R;
    protected initSocketIo(): void;
    onNewMessage(cb: (message: Message) => any): this;
    onNewChat(cb: (chat: PersonalChat) => any): this;
    onWriting(cb: (chatId: string) => any): this;
    onWritingEnd(cb: (chatId: string) => any): this;
    sendWritingIndicator(chatId: string): void;
    protected untilSocketConnected(): Promise<void>;
}
