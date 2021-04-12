export interface User {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    externalMetadata?: Record<string, unknown> | null;
    privateExternalMetadata?: Record<string, unknown> | null;
    blockStatus?: 'CANT_SEND_AND_RECEIVE_NEW_MESSAGES' | null;
}
