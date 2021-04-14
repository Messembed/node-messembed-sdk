export interface Message {
    _id: string;
    createdAt: Date;
    editedAt?: Date;
    chat: string;
    user: string;
    content: string;
    read: boolean;
    fromMe: boolean;
    externalMetadata?: Record<string, any>;
}
