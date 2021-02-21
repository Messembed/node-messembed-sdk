import { AxiosInstance } from 'axios';
import { PersonalChat } from './interfaces/personal-chat.interface';
import { User } from './interfaces/user.interface';
import { CreateMessageData } from './interfaces/create-message-data.interface';
import { Message } from './interfaces/message.interface';
import { FindMessagesResult } from './interfaces/find-messages-result.interface';
import { FindMessagesData } from './interfaces/find-messages-data.interface';
import { MessembedSDKOptions } from './interfaces/messembed-sdk-options.interface';
import { Update } from './interfaces';
export declare class MessembedSDK {
    protected axios: AxiosInstance;
    constructor(options: MessembedSDKOptions);
    getPersonalChats(): Promise<PersonalChat[]>;
    getMe(): Promise<User>;
    createMessage(createData: CreateMessageData): Promise<Message>;
    findMessages(findData: FindMessagesData): Promise<FindMessagesResult>;
    getUser(userId: string): Promise<User>;
    getUpdates(creationDateOfLastFetchedUpdate: Date | string): Promise<Update[]>;
    createChat(companionId: string): Promise<PersonalChat>;
    readChat(chatId: string): Promise<void>;
    protected parseDatesOfObjects<T extends Record<string, any>, R = T>(objects: T[], dateFields: readonly string[]): R[];
    protected parseDatesOfObject<T extends Record<string, any>, R = T>(obj: T, dateFields: readonly string[]): R;
}
