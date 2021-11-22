export class EditChatParams {
  chatId: string;
  active?: boolean;
  externalMetadata?: Record<string, any>;
  privateExternalMetadata?: Record<string, unknown>;
}