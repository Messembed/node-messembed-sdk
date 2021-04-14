export interface CreateMessageParams {
    chatId: string;
    content: string;
    attachments?: ({
        type?: string;
        url?: string;
    } | Record<string, unknown>)[];
    externalMetadata?: Record<string, any>;
}
