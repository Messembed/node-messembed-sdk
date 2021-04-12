export interface EditUserParams {
    userId: string;
    externalMetadata?: Record<string, unknown>;
    privateExternalMetadata?: Record<string, unknown>;
    blockStatus?: 'CANT_SEND_AND_RECEIVE_NEW_MESSAGES' | null;
    removeBlockStatus?: boolean;
}
