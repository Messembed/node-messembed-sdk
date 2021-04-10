export class ListPersonalChatsParams {
  /**
   * Поиск чатов по историю сообщений
   */
  query?: string;
  sort?: 'NEWER_FIRST' | 'UNREAD_FIRST';
  externalMetadata?: Record<string, unknown>
}
