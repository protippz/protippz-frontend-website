/**
 * Validates a JWT token to check that:
 * 1. It is a genuine 3-part JWT.
 * 2. It parses properly.
 * 3. Its expiration time (exp) has not passed.
 *
 * Safe for use in Edge Runtime, Node.js, and Browser.
 */
export function isTokenValid(token?: string | null): boolean {
  if (!token || typeof token !== "string") return false;

  const clean = token.replace(/^Bearer\s+/i, "").trim();
  if (
    !clean ||
    clean === "undefined" ||
    clean === "null" ||
    clean === "false" ||
    clean === "true" ||
    clean === "[object Object]"
  ) {
    return false;
  }

  const parts = clean.split(".");
  if (parts.length !== 3) {
    return false;
  }

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );

    let jsonString = "";
    if (typeof atob === "function") {
      jsonString = atob(padded);
    } else if (typeof Buffer !== "undefined") {
      jsonString = Buffer.from(padded, "base64").toString("utf-8");
    } else {
      return false;
    }

    const payload = JSON.parse(jsonString);

    if (payload && typeof payload.exp === "number") {
      const nowInSeconds = Math.floor(Date.now() / 1000);
      if (payload.exp < nowInSeconds) {
        // Token has expired
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

