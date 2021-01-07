export interface FindMessagesData {
  chatId: number;
  afterId?: number;
  beforeId?: number;
  offset?: number;
  limit?: number;
}
