export interface CreateMessageAsAdminParams {
  chatId: string;
  userId: string;
  content: string;

  /**
   * Information about attached files
   */
  attachments?: ({ type?: string; url?: string } | Record<string, unknown>)[];

  externalMetadata?: Record<string, any>;
}
