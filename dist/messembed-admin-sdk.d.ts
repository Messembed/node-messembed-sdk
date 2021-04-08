import { MessembedAdminSDKParams } from './interfaces/messembed-admin-sdk-params.interface';
import { AxiosInstance } from 'axios';
import { AccessToken } from './interfaces/access-token.interface';
import { PaginatedChats } from './interfaces/paginated-chats.interface';
import { Chat } from './interfaces/chat.interface';
import { CreateChatParams } from './interfaces/create-chat-params.interface';
import { CreateUserParams } from './interfaces/create-user-params.interface';
import { User } from './interfaces/user.interface';
import { ListMessagesParams, ListMessagesResult } from './interfaces';
import { EditUserParams } from './interfaces/edit-user-params.interface';
import { EditChatParams } from './interfaces/edit-chat-params.interface';
export declare class MessembedAdminSDK {
    protected axios: AxiosInstance;
    constructor(params: MessembedAdminSDKParams);
    getUser(userId: string): Promise<User>;
    createAccessToken(userId: string | number): Promise<AccessToken>;
    getAllChats(): Promise<PaginatedChats>;
    getChat(chatId: string): Promise<Chat>;
    getChatByCompanionsIds(companionsIds: string[]): Promise<Chat>;
    createChat(params: CreateChatParams): Promise<Chat>;
    editChat(params: EditChatParams): Promise<Chat>;
    createUser(params: CreateUserParams): Promise<User>;
    editUser(params: EditUserParams): Promise<User>;
    listMessages(params: Omit<ListMessagesParams, 'chatId'>): Promise<ListMessagesResult>;
    protected parseDatesOfObjects<T extends Record<string, any>, R = T>(objects: T[], dateFields: readonly string[]): R[];
    protected parseDatesOfObject<T extends Record<string, any>, R = T>(obj: T, dateFields: readonly string[]): R;
}
