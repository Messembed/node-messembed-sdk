export interface CreateMessageParams {
    chatId: string;
    content: string;
    externalMetadata?: Record<string, any>;
    privateExternalMetadata?: Record<string, any>;
}
