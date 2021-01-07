export interface Message {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  editedAt?: Date;
  chatId: number;
  userId: number;
  content: string;
  read: boolean;
  externalMetadata?: Record<string, any>;
  privateExternalMetadata?: Record<string, any>;
}
