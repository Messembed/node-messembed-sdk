import { Message } from './message.interface';
export interface FindMessagesResult {
    afterId?: number;
    beforeId?: number;
    offset?: number;
    limit?: number;
    messages: Message[];
}
