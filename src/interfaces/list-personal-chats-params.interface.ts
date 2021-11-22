export class ListPersonalChatsParams {
  /**
   * Поиск чатов по историю сообщений
   */
  query?: string;
  sort?: 'NEWER_FIRST' | 'UNREAD_FIRST';
  externalMetadata?: Record<string, unknown>;

  /**
   * Чтобы в результате были также неактивные чаты (с `active: false`)
   * поставьте этот параметр true.
   *
   * @default false
   */
  includeInactive?: boolean;
}
