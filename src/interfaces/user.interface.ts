export interface User {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  externalMetadata?: Record<string, unknown> | null;
  privateExternalMetadata?: Record<string, unknown> | null;
}
