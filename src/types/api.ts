/** Standard envelope returned by the ProTippz backend. */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  statusCode?: number;
  data: T;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

/** `data` shape for list endpoints: `{ meta, result }`. */
export interface Paginated<T> {
  meta?: PaginationMeta;
  result: T[];
}

export type PaginatedResponse<T> = ApiResponse<Paginated<T>>;

export interface PaginationParams {
  page?: number | string;
  limit?: number | string;
}

export interface ListParams extends PaginationParams {
  searchTerm?: string;
  sort?: string;
}

/** Query-string params accepted by `fetchBaseQuery` (undefined values are dropped). */
export type QueryParams = Record<string, string | number | boolean | undefined | null>;

/** Body accepted by JSON or multipart endpoints. */
export type RequestBody = Record<string, unknown> | FormData;
