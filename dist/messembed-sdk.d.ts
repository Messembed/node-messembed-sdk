/// <reference types="node" />
import { AxiosInstance } from 'axios';
import { PersonalChat } from './interfaces/personal-chat.interface';
import { User } from './interfaces/user.interface';
import { CreateMessageData } from './interfaces/create-message-data.interface';
import { Message } from './interfaces/message.interface';
import { FindMessagesResult } from './interfaces/find-messages-result.interface';
import { FindMessagesData } from './interfaces/find-messages-data.interface';
import { MessembedSDKOptions } from './interfaces/messembed-sdk-options.interface';
import { Update } from './interfaces';
import { Socket } from 'socket.io-client';
import { EventEmitter } from 'events';
export declare class MessembedSDK {
    protected axios: AxiosInstance;
    protected params: MessembedSDKOptions;
    protected socket: typeof Socket;
    protected eventEmitter: EventEmitter;
    protected chatsWritingIndicators: {
        [chatId: string]: {
            writing: boolean;
            clearWritingTimeout?: any;
        };
    };
    constructor(params: MessembedSDKOptions);
    getPersonalChats(): Promise<PersonalChat[]>;
    getMe(): Promise<User>;
    createMessage(createData: CreateMessageData): Promise<Message>;
    sendMessageOverWS(params: {
        chatId: string;
        content: string;
    }): Promise<void>;
    findMessages(findData: FindMessagesData): Promise<FindMessagesResult>;
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
