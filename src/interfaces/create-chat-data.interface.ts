export interface CreateChatData {
  externalMetadata?: Record<string, any>;
  privateExternalMetadata?: Record<string, any>;
  firstCompanionId: string;
  secondCompanionId: string;
}
