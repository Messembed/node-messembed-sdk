export interface Message {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  editedAt?: Date;
  chat: string;
  user: string;
  content: string;
  read: boolean;
  fromMe: boolean;
  externalMetadata?: Record<string, any>;
  privateExternalMetadata?: Record<string, any>;
}
