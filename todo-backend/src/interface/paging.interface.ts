export const DEFAULT_LIMIT = 10;

export interface PagingInterface {
  offset: number;
  limit: number;
}

export interface SortingInterface {
  sort: string;
  sortOrder: 'ASC' | 'DESC';
}
