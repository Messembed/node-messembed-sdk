import { Chat } from './chat.interface';

export interface PaginatedChats {
  totalCount: number;
  data: Chat[];
}
