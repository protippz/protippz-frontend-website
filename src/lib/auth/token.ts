import Cookies from "js-cookie";
import { isTokenValid } from "@/lib/authUtils";

/**
 * Single source of truth for reading / writing the auth token on the client.
 *
 * The token is mirrored to:
 *  - a cookie (`token`)  -> read by `src/proxy.ts` and server components
 *  - localStorage        -> kept for backwards compatibility with existing sessions
 */

export const TOKEN_KEY = "token";
const LEGACY_TOKEN_KEY = "accessToken";

const isBrowser = () => typeof window !== "undefined";

const cookieOptions = (): Cookies.CookieAttributes => ({
  path: "/",
  sameSite: "lax",
  secure: isBrowser() && window.location.protocol === "https:",
});

/** Returns the raw token (without a `Bearer ` prefix) or `null`. */
export function getAuthToken(): string | null {
  if (!isBrowser()) return null;
  let token: string | null | undefined = Cookies.get(TOKEN_KEY);
  if (!token) {
    try {
      token =
        window.localStorage.getItem(TOKEN_KEY) ||
        window.localStorage.getItem(LEGACY_TOKEN_KEY);
    } catch {
      token = null;
    }
  }
  if (!token) return null;
  const clean = token.replace(/^Bearer\s+/i, "").trim();
  return clean || null;
}

/** Returns the token only if it is a well-formed, non-expired JWT. */
export function getValidAuthToken(): string | null {
  const token = getAuthToken();
  return token && isTokenValid(token) ? token : null;
}

export function setAuthToken(token: string | null | undefined): void {
  if (!isBrowser() || !token) return;
  // Remove any stale cookie first (older versions set it without a path).
  Cookies.remove(TOKEN_KEY);
  Cookies.set(TOKEN_KEY, token, cookieOptions());
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* storage unavailable (private mode) – cookie is still set */
  }
}

export function clearAuthToken(): void {
  if (!isBrowser()) return;
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(TOKEN_KEY, { path: "/" });
  try {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(LEGACY_TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

/** Removes the token if it exists but is malformed / expired. */
export function clearStaleAuthToken(): void {
  const token = getAuthToken();
  if (token && !isTokenValid(token)) clearAuthToken();
}
