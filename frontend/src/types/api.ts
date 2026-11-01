/** Shapes returned by the backend. See the backend README "API conventions". */

export interface ApiResponse<T> {
  data: T;
}

export interface PageMeta {
  page: number;
  pageSize: number;
  total: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PageMeta;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/** Money always travels as a string such as "125000.00". Never convert it to a JS number for maths. */
export type Money = string;
