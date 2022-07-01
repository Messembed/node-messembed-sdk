import { Chat } from './chat.interface';
import { Message } from './message.interface';
export interface NewMessageForAdminInput {
    message: Message;
    chat: Chat;
}
