export interface EditUserParams {
    userId: string;
    externalMetadata?: Record<string, unknown>;
    privateExternalMetadata?: Record<string, unknown>;
}
