export interface CreateChatParams {
  externalMetadata?: Record<string, any>;
  privateExternalMetadata?: Record<string, any>;
  firstCompanionId: string;
  secondCompanionId: string;
}
