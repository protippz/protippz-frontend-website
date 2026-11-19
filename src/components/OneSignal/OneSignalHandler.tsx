"use client";

import { useEffect, useRef } from "react";
import { useAuth, type User } from "@/provider/ContextProvider";
import { getAuthToken } from "@/lib/auth/token";
import { getTokenPayload } from "@/lib/authUtils";
import { initializeOneSignal, oneSignalLogout, syncOneSignalUser } from "@/lib/onesignal";

const asId = (value: unknown): string | null =>
  typeof value === "string" && value.trim() ? value.trim() : null;

/**
 * The ACCOUNT id (auth `User._id`) – the same id the backend has in `req.user`
 * and in the login response. The backend sends pushes to this id as the
 * OneSignal `external_id`, so it must never be the fan/player/team profile id.
 */
function resolveAccountId(profile: User | null): string | null {
  const account = profile?.user as unknown;
  const fromProfile =
    asId(account) ??
    asId((account as { _id?: unknown } | undefined)?._id) ??
    asId((account as { id?: unknown } | undefined)?.id);
  if (fromProfile) return fromProfile;

  const jwt = getTokenPayload(getAuthToken());
  return asId(jwt?.id) ?? asId(jwt?.userId) ?? asId(jwt?._id) ?? asId(jwt?.user?._id);
}

/**
 * Mount once (inside AuthProvider). Loads OneSignal after the page is idle and
 * keeps the OneSignal external id in sync with the logged-in account.
 */
export default function OneSignalHandler() {
  const { userData, loading } = useAuth();
  const syncedUserId = useRef<string | null>(null);

  // Load the SDK when the browser is idle so it never competes with page rendering.
  useEffect(() => {
    const start = () => initializeOneSignal();
    if ("requestIdleCallback" in window) {
      const handle = window.requestIdleCallback(start, { timeout: 3000 });
      return () => window.cancelIdleCallback(handle);
    }
    const timer = setTimeout(start, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Link / unlink the account whenever the authenticated identity changes.
  useEffect(() => {
    if (loading) return;
    const userId = userData ? resolveAccountId(userData) : null;
    if (userId === syncedUserId.current) return;

    const previous = syncedUserId.current;
    syncedUserId.current = userId;

    if (userId) {
      void syncOneSignalUser({
        _id: userId,
        email: userData?.user?.email ?? userData?.email,
        name: userData?.name ?? userData?.username,
        role: userData?.user?.role,
      });
    } else if (previous) {
      void oneSignalLogout();
    }
  }, [userData, loading]);

  return null;
}
