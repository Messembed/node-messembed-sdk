import { Message } from './message.interface';
import { Chat } from './chat.interface';

export interface Update {
  _id: string;
  createdAt: string;
  chatId: string;
  type: 'new_message' | 'new_chat';
  message?: Message;
  chat?: Chat;
}
