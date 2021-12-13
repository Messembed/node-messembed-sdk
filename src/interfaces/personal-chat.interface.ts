export interface PersonalChat {
  _id: string;

  createdAt: Date;

  updatedAt: Date;

  deletedAt?: Date | null;

  active: boolean;

  externalMetadata?: Record<string, unknown> | null;

  lastMessage: Record<string, any>;

  companion: Record<string, any>;

  unreadMessagesCount: number;
}
