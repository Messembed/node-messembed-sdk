export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  externalId: string;
  externalMetadata?: Record<string, any>;
  privateExternalMetadata?: Record<string, any>;
}
