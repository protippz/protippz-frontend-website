/**
 * Central place for API / site URL configuration.
 *
 * Values can be overridden per-environment with:
 *   NEXT_PUBLIC_API_BASE_URL  (default: https://api.protippz.com)
 *   NEXT_PUBLIC_SITE_URL      (default: https://www.protippz.com)
 */

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const API_BASE_URL = stripTrailingSlash(
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.protippz.com",
);

/** Canonical public origin of the website (apex redirects to www). */
export const SITE_URL = stripTrailingSlash(
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.protippz.com",
);

/** Builds an absolute backend URL from a relative API path. */
export const apiUrl = (path: string): string => {
  if (!path) return API_BASE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

/** Resolves an image path returned by the backend into an absolute URL. */
export const imageUrl = (url?: string | null): string => {
  if (!url) return "";
  if (/^(https?:)?\/\//i.test(url) || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

/** Builds an absolute URL on the public website (for canonical / OG tags). */
export const siteUrl = (path = "/"): string =>
  `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
