import { Message } from './message.interface';
import { User } from './user.interface';

export interface Chat {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  active: boolean;
  firstCompanion: User;
  secondCompanion: User;
  externalMetadata?: Record<string, unknown> | null;
  privateExternalMetadata?: Record<string, unknown> | null;
  lastMessage: Message;
  notReadByFirstCompanionMessagesCount?: number;
  notReadBySecondCompanionMessagesCount?: number;
}
