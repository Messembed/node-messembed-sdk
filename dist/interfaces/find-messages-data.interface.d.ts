export interface FindMessagesData {
    chatId: string;
    afterId?: string;
    beforeId?: string;
    offset?: number;
    limit?: number;
}
