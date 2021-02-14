import { MessembedAdminSDKOptions } from './interfaces/messembed-admin-sdk-options.interface';
import { AxiosInstance } from 'axios';
import { AccessToken } from './interfaces/access-token.interface';
import { PaginatedChats } from './interfaces/paginated-chats.interface';
import { Chat } from './interfaces/chat.interface';
import { CreateChatData } from './interfaces/create-chat-data.interface';
import { CreateUserData } from './interfaces/create-user-data.interface';
import { User } from './interfaces/user.interface';
export declare class MessembedAdminSDK {
    protected axios: AxiosInstance;
    constructor(options: MessembedAdminSDKOptions);
    getUser(userId: string): Promise<User>;
    createAccessToken(userId: string | number): Promise<AccessToken>;
    getAllChats(): Promise<PaginatedChats>;
    getChat(chatId: string): Promise<Chat>;
    createChat(createData: CreateChatData): Promise<Chat>;
    createUser(createData: CreateUserData): Promise<User>;
    protected parseDatesOfObjects<T extends Record<string, any>, R = T>(objects: T[], dateFields: readonly string[]): R[];
    protected parseDatesOfObject<T extends Record<string, any>, R = T>(obj: T, dateFields: readonly string[]): R;
}
