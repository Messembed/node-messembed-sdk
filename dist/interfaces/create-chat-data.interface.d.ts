export interface CreateChatData {
    title: string;
    externalMetadata?: Record<string, any>;
    privateExternalMetadata?: Record<string, any>;
    firstCompanionId: string;
    secondCompanionId: string;
}
