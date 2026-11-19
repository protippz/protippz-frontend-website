import "server-only";
import { cookies } from "next/headers";
import { apiUrl } from "./config";
import type { ApiResponse, QueryParams } from "@/types/api";

/**
 * Server-side data access for React Server Components, route handlers and
 * server actions.
 *
 * Client components must use the RTK Query hooks in `src/redux/features/*`.
 * This helper exists so SEO-critical pages (player/team profiles, listings,
 * legal pages, community posts) are fully rendered on the server.
 */

type Method = "GET" | "POST" | "PATCH" | "DELETE";

export interface ServerFetchOptions {
  method?: Method;
  params?: QueryParams;
  body?: Record<string, unknown> | FormData;
  /** Attach the visitor's `token` cookie. Defaults to `true`. */
  auth?: boolean;
  /** ISR revalidation in seconds. Omit (or `false`) for no caching. */
  revalidate?: number | false;
  tags?: string[];
}

const buildQuery = (params?: QueryParams): string => {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.append(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
};

export async function getServerToken(): Promise<string | null> {
  try {
    const store = await cookies();
    const raw = store.get("token")?.value;
    return raw ? raw.replace(/^Bearer\s+/i, "").trim() || null : null;
  } catch {
    // `cookies()` is unavailable outside a request scope (e.g. at build time).
    return null;
  }
}

/**
 * Calls the backend and returns the parsed JSON envelope.
 * Never throws – network / parse failures resolve to `{ success: false }` so
 * pages can render an empty state instead of crashing.
 */
export async function serverFetch<T = unknown>(
  path: string,
  { method = "GET", params, body, auth = true, revalidate, tags }: ServerFetchOptions = {},
): Promise<ApiResponse<T | null>> {
  const headers: Record<string, string> = { Accept: "application/json" };

  if (auth) {
    const token = await getServerToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (body && !isFormData) headers["Content-Type"] = "application/json";

  // Authenticated responses are user-specific and must never be shared via the
  // data cache.
  const canCache = typeof revalidate === "number" && !headers.Authorization;

  try {
    const response = await fetch(`${apiUrl(path)}${buildQuery(params)}`, {
      method,
      headers,
      body: body ? (isFormData ? (body as FormData) : JSON.stringify(body)) : undefined,
      ...(canCache ? { next: { revalidate, tags } } : { cache: "no-store" as const }),
    });

    const json = (await response.json().catch(() => null)) as ApiResponse<T> | null;
    if (json && typeof json === "object") return json;

    return { success: false, message: `Request failed (${response.status})`, data: null };
  } catch (error) {
    console.error(`[serverFetch] ${method} ${path} failed:`, error);
    return { success: false, message: "Network error", data: null };
  }
}
