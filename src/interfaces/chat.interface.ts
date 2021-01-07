export interface Chat {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  title: string;
  active: boolean;
  firstCompanionId: string;
  secondCompanionId: string;
  externalMetadata?: Record<string, unknown> | null;
  privateExternalMetadata?: Record<string, unknown> | null;
  lastMessageId: number;
}
