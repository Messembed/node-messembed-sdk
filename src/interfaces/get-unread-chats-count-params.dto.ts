export interface GetUnreadChatsCountParams {
  /**
   * Чтобы в результате были учтены также неактивные чаты (с `active: false`)
   * поставьте этот параметр true.
   *
   * @default false
   */
  includeInactive?: boolean;
}
