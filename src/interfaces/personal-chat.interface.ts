export interface PersonalChat {
  id: number;

  createdAt: Date;

  updatedAt: Date;

  deletedAt?: Date | null;

  title: string;

  active: boolean;

  externalMetadata?: Record<string, unknown> | null;

  lastMessageId: number;

  lastMessage: Record<string, any>;

  companion: Record<string, any>;

  unreadMessagesCount: number;
}
