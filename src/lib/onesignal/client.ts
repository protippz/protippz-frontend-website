import {
  buildInitOptions,
  ONESIGNAL_APP_ID,
  ONESIGNAL_DEBUG,
  ONESIGNAL_SCRIPT_ID,
  ONESIGNAL_SDK_URL,
  TIMEOUTS,
} from "./config";
import type { OneSignalSDK, PushSubscriptionChangeEvent } from "./types";

/**
 * Framework-agnostic OneSignal Web SDK v16 client.
 *
 * - The SDK is loaded once, lazily, and `init()` runs exactly once.
 * - `getOneSignal()` resolves ONLY with a fully initialised SDK (or `null` when
 *   push is unavailable: no app id, SSR, ad-blocker, unsupported browser, init error).
 * - Every public helper is safe to call anywhere and never throws.
 */

// ---- logging --------------------------------------------------------------------

const PREFIX = "[OneSignal]";
const log = {
  debug: (...args: unknown[]) => {
    if (ONESIGNAL_DEBUG) console.info(PREFIX, ...args);
  },
  warn: (...args: unknown[]) => {
    if (ONESIGNAL_DEBUG) console.warn(PREFIX, ...args);
  },
  error: (...args: unknown[]) => console.error(PREFIX, ...args),
};

// ---- storage (push subscription id cache) -----------------------------------------

const STORAGE_KEY = "onesignal_push_subscription_id";
const LEGACY_STORAGE_KEY = "onesignal_player_id";

const storage = {
  get(): string {
    try {
      return localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  },
  set(id: string) {
    try {
      localStorage.setItem(STORAGE_KEY, id);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
  },
  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
  },
};

// ---- helpers -------------------------------------------------------------------------

const isBrowser = () => typeof window !== "undefined";

/** Resolves with `fallback` if `promise` hasn't settled within `ms`. Never rejects. */
const withTimeout = <T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> =>
  new Promise((resolve) => {
    const timer = setTimeout(() => resolve(fallback), ms);
    promise
      .then((value) => resolve(value))
      .catch(() => resolve(fallback))
      .finally(() => clearTimeout(timer));
  });

const activeSubscriptionId = (sdk: OneSignalSDK | null | undefined): string => {
  const sub = sdk?.User?.PushSubscription;
  return sub?.id && sub.optedIn ? sub.id : "";
};

const rememberSubscription = (sdk: OneSignalSDK) => {
  const id = activeSubscriptionId(sdk);
  if (id) storage.set(id);
  return id;
};

// ---- initialisation ----------------------------------------------------------------

let sdkPromise: Promise<OneSignalSDK | null> | null = null;

function loadScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById(ONESIGNAL_SCRIPT_ID) || window.OneSignal) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = ONESIGNAL_SCRIPT_ID;
    script.src = ONESIGNAL_SDK_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      log.warn("SDK script failed to load (blocked by the browser or an ad-blocker).");
      resolve(false);
    };
    document.head.appendChild(script);
  });
}

function initialise(): Promise<OneSignalSDK | null> {
  return new Promise((resolve) => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal) => {
      try {
        if (ONESIGNAL_DEBUG) OneSignal.Debug?.setLogLevel("warn");
        await OneSignal.init(buildInitOptions());

        rememberSubscription(OneSignal);
        OneSignal.User.PushSubscription.addEventListener(
          "change",
          ({ current }: PushSubscriptionChangeEvent) => {
            if (current.id && current.optedIn) {
              storage.set(current.id);
              log.debug("Push subscription active.");
            } else if (!current.optedIn) {
              storage.clear();
              log.debug("Push subscription opted out.");
            }
          },
        );

        log.debug("Initialised.", { permission: OneSignal.Notifications.permissionNative });
        resolve(OneSignal);
      } catch (error) {
        // e.g. app id / site URL mismatch in the OneSignal dashboard.
        log.error("Initialisation failed:", error);
        resolve(null);
      }
    });

    loadScript().then((loaded) => {
      if (!loaded) resolve(null);
    });
  });
}

/**
 * Returns the initialised SDK, starting the load on first call.
 * Resolves `null` when push notifications are unavailable.
 */
export function getOneSignal(): Promise<OneSignalSDK | null> {
  if (!isBrowser() || !ONESIGNAL_APP_ID) {
    if (isBrowser() && !ONESIGNAL_APP_ID) log.warn("NEXT_PUBLIC_ONESIGNAL_APP_ID is not set.");
    return Promise.resolve(null);
  }
  // Load + init happen once per page session. A failure (usually an ad-blocker)
  // is final for the session – retrying would only queue a second `init()`.
  sdkPromise ??= initialise();
  return sdkPromise;
}

/** Like `getOneSignal()` but gives up after `ms` (the SDK keeps loading in the background). */
const getOneSignalWithin = (ms: number) => withTimeout(getOneSignal(), ms, null);

/** Starts loading the SDK without waiting for it. */
export function initializeOneSignal(): void {
  void getOneSignal();
}

// ---- push subscription ---------------------------------------------------------------

/** Synchronous best-effort subscription id (live SDK value, else cached). */
export function getStoredPushSubscriptionId(): string {
  if (!isBrowser()) return "";
  return activeSubscriptionId(window.OneSignal) || storage.get();
}

/**
 * Resolves the genuine OneSignal push subscription id for this browser, or "".
 * Sent to the backend at login/sign-up as `playerId`. Never blocks longer than
 * `TIMEOUTS.ready + timeoutMs`.
 */
export async function getOneSignalPushSubscriptionId(
  timeoutMs: number = TIMEOUTS.subscriptionId,
): Promise<string> {
  if (!isBrowser()) return "";

  const cached = getStoredPushSubscriptionId();
  if (cached) return cached;

  const sdk = await getOneSignalWithin(TIMEOUTS.ready);
  if (!sdk) return "";

  try {
    // Browser permission already granted but not subscribed yet → subscribe.
    if (sdk.Notifications.permission && !sdk.User.PushSubscription.optedIn) {
      await sdk.User.PushSubscription.optIn();
    }
  } catch (error) {
    log.warn("optIn failed:", error);
  }

  const immediate = rememberSubscription(sdk);
  if (immediate) return immediate;

  // The subscription handshake may still be in flight – wait briefly for it.
  const subscription = sdk.User.PushSubscription;
  return new Promise<string>((resolve) => {
    const done = (id: string) => {
      clearTimeout(timer);
      subscription.removeEventListener("change", onChange);
      if (id) storage.set(id);
      resolve(id);
    };
    const onChange = ({ current }: PushSubscriptionChangeEvent) => {
      if (current.id && current.optedIn) done(current.id);
    };
    const timer = setTimeout(() => done(activeSubscriptionId(sdk)), timeoutMs);
    subscription.addEventListener("change", onChange);
  });
}

/** Explicitly asks for notification permission (call from a user gesture). */
export async function requestNotificationPermission(): Promise<boolean> {
  const sdk = await getOneSignal();
  if (!sdk || !sdk.Notifications.isPushSupported()) return false;
  try {
    if (!sdk.Notifications.permission) await sdk.Notifications.requestPermission();
    if (!sdk.Notifications.permission) return false;
    await sdk.User.PushSubscription.optIn();
    return Boolean(rememberSubscription(sdk));
  } catch (error) {
    log.warn("Permission request failed:", error);
    return false;
  }
}

// ---- identity ----------------------------------------------------------------------------

export interface OneSignalIdentity {
  /** Account (auth `User`) `_id` – the ONLY value used as OneSignal external id. */
  _id: string;
  email?: string | null;
  name?: string | null;
  role?: string | null;
}

/**
 * Links this browser's subscription to the authenticated user (external id = DB `_id`)
 * and sets segmentation tags. Idempotent: does nothing if already linked.
 */
export async function syncOneSignalUser(
  user: OneSignalIdentity,
  timeoutMs: number = TIMEOUTS.ready,
): Promise<void> {
  const externalId = typeof user?._id === "string" ? user._id.trim() : "";
  if (!externalId) {
    log.warn("Skipping sync: no database user id.");
    return;
  }

  const sdk = await getOneSignalWithin(timeoutMs);
  if (!sdk) return;

  try {
    if (sdk.User.externalId !== externalId) {
      await sdk.login(externalId);
      log.debug("Linked external id.");

      const email = user.email?.trim();
      if (email && email.includes("@")) sdk.User.addEmail(email);
    }

    const tags: Record<string, string> = {};
    if (user.role) tags.role = String(user.role);
    if (user.name) tags.username = String(user.name);
    if (Object.keys(tags).length) sdk.User.addTags(tags);

    // Permission granted earlier (e.g. before login) but not yet subscribed.
    if (sdk.Notifications.permission && !sdk.User.PushSubscription.optedIn) {
      await sdk.User.PushSubscription.optIn();
    }
    rememberSubscription(sdk);
  } catch (error) {
    log.warn("User sync failed:", error);
  }
}

/** Unlinks the user from this browser. Bounded so sign-out never hangs. */
export async function oneSignalLogout(): Promise<void> {
  if (!isBrowser()) return;
  try {
    // Only wait for an SDK that is already loading; never trigger a fresh load on sign-out.
    const sdk = sdkPromise ? await withTimeout(sdkPromise, TIMEOUTS.logout, null) : null;
    if (sdk?.User.externalId) await withTimeout(sdk.logout(), TIMEOUTS.logout, undefined);
  } catch (error) {
    log.warn("Logout failed:", error);
  } finally {
    storage.clear();
  }
}
