export interface CreateMessageAsAdminParams {
    chatId: string;
    userId: string;
    content: string;
    attachments?: ({
        type?: string;
        url?: string;
    } | Record<string, unknown>)[];
    externalMetadata?: Record<string, any>;
}
