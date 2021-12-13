export interface ListMessagesParams {
  chatId: string;
  after?: Date;
  before?: Date;
  offset?: number;
  limit?: number;
  read?: boolean;
}
