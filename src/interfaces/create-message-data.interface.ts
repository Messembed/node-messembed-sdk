export interface CreateMessageData {
  chatId: number;
  userId: string;
  content: string;
  externalMetadata?: Record<string, any>;
  privateExternalMetadata?: Record<string, any>;
}
