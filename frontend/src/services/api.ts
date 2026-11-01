import type { ApiErrorBody } from "../types/api";

const BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1").replace(
  /\/$/,
  "",
);

/** Error thrown for every failed request. `code` matches the backend error code. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type TokenGetter = () => Promise<string | null>;

let getToken: TokenGetter = async () => null;
let onUnauthorized: () => void = () => {};

/** JM-08 wires this to Firebase: `setTokenGetter(() => auth.currentUser?.getIdToken() ?? null)`. */
export function setTokenGetter(fn: TokenGetter) {
  getToken = fn;
}

/** Called when the API answers 401, e.g. to sign out and go to /login (JM-08). */
export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn;
}

/** A new key per form submission. Send it with sale and payment POSTs so a double click can't duplicate them. */
export const newIdempotencyKey = () => crypto.randomUUID();

type Query = Record<string, string | number | boolean | undefined | null>;

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Query;
  idempotencyKey?: string;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: Query) {
  const url = new URL(BASE_URL + (path.startsWith("/") ? path : `/${path}`));
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "")
      url.searchParams.set(key, String(value));
  }
  return url.toString();
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.idempotencyKey) headers["Idempotency-Key"] = options.idempotencyKey;

  const token = await getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(buildUrl(path, options.query), {
      method: options.method ?? "GET",
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError(
      0,
      "NETWORK_ERROR",
      "Cannot reach the server. Check that the backend is running.",
    );
  }

  const text = await res.text();
  let json: unknown;
  try {
    json = text ? JSON.parse(text) : undefined;
  } catch {
    // e.g. an HTML error page from a proxy
    if (res.ok)
      throw new ApiError(res.status, "INVALID_RESPONSE", "The server sent an unreadable response");
  }

  if (!res.ok) {
    if (res.status === 401) onUnauthorized();
    const body = json as ApiErrorBody | undefined;
    throw new ApiError(
      res.status,
      body?.error?.code ?? `HTTP_${res.status}`,
      body?.error?.message || res.statusText || "Request failed",
      body?.error?.details,
    );
  }

  return json as T;
}

export const api = {
  get: <T>(path: string, query?: Query, signal?: AbortSignal) =>
    request<T>(path, { query, signal }),
  post: <T>(path: string, body?: unknown, opts?: { idempotencyKey?: string }) =>
    request<T>(path, { method: "POST", body, ...opts }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
