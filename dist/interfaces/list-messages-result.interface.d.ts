import { Message } from './message.interface';
export interface ListMessagesResult {
    afterId?: number;
    beforeId?: number;
    offset?: number;
    limit?: number;
    messages: Message[];
}
