export interface CreateMessageData {
  chatId: string;
  content: string;
  externalMetadata?: Record<string, any>;
  privateExternalMetadata?: Record<string, any>;
}
