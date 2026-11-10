"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/provider/ContextProvider";

type OneSignalSDK = {
  init: (options: Record<string, unknown>) => Promise<void>;
  login: (externalId: string) => Promise<void>;
  logout: () => Promise<void>;

  Notifications: {
    permission: boolean;
    permissionNative?: "default" | "granted" | "denied";
    requestPermission: () => Promise<void>;
    addEventListener: (
      event: string,
      callback: (event: any) => void
    ) => void;
    removeEventListener: (
      event: string,
      callback: (event: any) => void
    ) => void;
  };

  User: {
    onesignalId: string | null;
    externalId?: string | null;

    addEmail?: (email: string) => Promise<void> | void;
    removeEmail?: (email: string) => Promise<void> | void;
    addTag: (key: string, value: string) => void;
    removeTag?: (key: string) => void;
    addEventListener?: (
      event: string,
      callback: (event: any) => void
    ) => void;
    removeEventListener?: (
      event: string,
      callback: (event: any) => void
    ) => void;

    PushSubscription: {
      id: string | null;
      token: string | null;
      optedIn: boolean;

      optIn: () => Promise<void>;
      optOut: () => Promise<void>;

      addEventListener: (
        event: string,
        callback: (event: any) => void
      ) => void;

      removeEventListener: (
        event: string,
        callback: (event: any) => void
      ) => void;
    };
  };

  Slidedown?: {
    promptPush: (options?: Record<string, unknown>) => Promise<void>;
  };
};

declare global {
  interface Window {
    OneSignal?: OneSignalSDK;
    OneSignalDeferred?: Array<
      (OneSignal: OneSignalSDK) => void | Promise<void>
    >;
  }
}

const SCRIPT_ID = "onesignal-sdk-script";
const STORAGE_KEY_PUSH_ID = "onesignal_push_subscription_id";

let initializationPromise: Promise<OneSignalSDK | null> | null = null;
let isInitialized = false;

// --------------------------------------------------
// 1. Load and initialize OneSignal SDK v16 (Singleton)
// --------------------------------------------------
export const initializeOneSignal = (): Promise<OneSignalSDK | null> => {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  if (isInitialized && window.OneSignal) {
    return Promise.resolve(window.OneSignal);
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
  const safariWebId = process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID;

  if (!appId) {
    console.warn("[OneSignal] NEXT_PUBLIC_ONESIGNAL_APP_ID is not configured.");
    return Promise.resolve(null);
  }

  initializationPromise = new Promise((resolve) => {
    let completed = false;

    const finish = (sdk: OneSignalSDK | null) => {
      if (completed) return;
      completed = true;
      if (sdk) isInitialized = true;
      resolve(sdk);
    };

    // 4-second safety timeout so authentication/UI never hangs
    const timer = setTimeout(() => {
      console.warn("[OneSignal] Initialization timed out (4s). Proceeding gracefully.");
      finish(window.OneSignal || null);
    }, 4000);

    try {
      window.OneSignalDeferred = window.OneSignalDeferred || [];

      // Avoid injecting duplicate script if already present in DOM
      let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
      if (!script) {
        script = document.querySelector('script[src*="OneSignalSDK.page.js"]') as HTMLScriptElement | null;
      }

      if (!script) {
        script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
        script.async = true;
        script.defer = true;

        script.onerror = () => {
          clearTimeout(timer);
          console.warn("[OneSignal] SDK script blocked or failed to load (adblocker detected).");
          finish(null);
        };

        document.head.appendChild(script);
      }

      // Queue initialization with diagnostics
      window.OneSignalDeferred.push(async (OneSignal: OneSignalSDK) => {
        console.log("[OneSignal] SDK callback executed");

        try {
          console.log("[OneSignal] SDK object:", !!OneSignal);

          if (!isInitialized) {
            const initConfig: Record<string, unknown> = {
              appId,
              allowLocalhostAsSecureOrigin: true,
              serviceWorkerPath: "/OneSignalSDKWorker.js",
              serviceWorkerParam: {
                scope: "/",
              },
              notifyButton: {
                enable: false,
              },
              promptOptions: {
                slidedown: {
                  prompts: [
                    {
                      type: "push",
                      autoPrompt: true,
                      text: {
                        actionMessage: "We'd like to show you notifications for the latest updates and tips.",
                        acceptButton: "Allow",
                        cancelButton: "Later",
                      },
                      delay: {
                        pageViews: 1,
                        timeDelay: 1,
                      },
                    },
                  ],
                },
              },
            };

            if (safariWebId) {
              initConfig.safari_web_id = safariWebId;
            }

            await OneSignal.init(initConfig);
            console.log("[OneSignal] Initialized successfully");
          }

          console.log("[OneSignal] User ID:", OneSignal.User?.onesignalId);
          console.log("[OneSignal] External ID:", OneSignal.User?.externalId);
          console.log("[OneSignal] Subscription ID:", OneSignal.User?.PushSubscription?.id);
          console.log("[OneSignal] Opted in:", OneSignal.User?.PushSubscription?.optedIn);

          // Check if user is already opted in and update storage
          const sub = OneSignal.User?.PushSubscription;
          if (sub?.id && sub?.optedIn) {
            localStorage.setItem(STORAGE_KEY_PUSH_ID, sub.id);
            localStorage.setItem("onesignal_player_id", sub.id);
          }

          // Listen for push subscription changes (e.g. user allows permission later)
          OneSignal.User?.PushSubscription?.addEventListener?.("change", (event: any) => {
            const currentSub = event?.current;
            if (currentSub?.id && currentSub?.optedIn) {
              localStorage.setItem(STORAGE_KEY_PUSH_ID, currentSub.id);
              localStorage.setItem("onesignal_player_id", currentSub.id);
              console.log("[OneSignal] Push subscription active:", currentSub.id);
            } else if (!currentSub?.optedIn) {
              localStorage.removeItem(STORAGE_KEY_PUSH_ID);
              localStorage.removeItem("onesignal_player_id");
              console.log("[OneSignal] Push subscription opted out or removed.");
            }
          });

          clearTimeout(timer);
          finish(OneSignal);
        } catch (error) {
          clearTimeout(timer);
          console.error("[OneSignal] Initialization failed:", error);
          finish(OneSignal || null);
        }
      });
    } catch (err) {
      clearTimeout(timer);
      console.warn("[OneSignal] Initialization setup failed:", err);
      finish(null);
    }
  });

  return initializationPromise;
};

// --------------------------------------------------
// 2. Synchronous cached push subscription ID getter
// --------------------------------------------------
export const getStoredPushSubscriptionId = (): string => {
  if (typeof window === "undefined") return "";
  try {
    const liveSub = window.OneSignal?.User?.PushSubscription;
    if (liveSub?.id && liveSub?.optedIn) {
      return liveSub.id;
    }
    const cached =
      localStorage.getItem(STORAGE_KEY_PUSH_ID) ||
      localStorage.getItem("onesignal_player_id") ||
      "";
    return cached || "";
  } catch {
    return "";
  }
};

// --------------------------------------------------
// 3. Genuine Push Subscription ID (Never fake UUID!)
// --------------------------------------------------
export const getOneSignalPushSubscriptionId = async (timeoutMs = 1500): Promise<string> => {
  if (typeof window === "undefined") return "";

  // 1. Instant return if live or cached subscription exists
  const immediate = getStoredPushSubscriptionId();
  if (immediate) return immediate;

  try {
    const sdk = await initializeOneSignal();
    if (!sdk) return "";

    const sub = sdk.User?.PushSubscription;
    if (sub?.id && sub?.optedIn) {
      localStorage.setItem(STORAGE_KEY_PUSH_ID, sub.id);
      localStorage.setItem("onesignal_player_id", sub.id);
      return sub.id;
    }

    // If permission was already granted in browser but subscription not yet opted in, attempt opt-in
    if (sdk.Notifications?.permission && typeof sub?.optIn === "function") {
      try {
        await sub.optIn();
        if (sub?.id && sub?.optedIn) {
          localStorage.setItem(STORAGE_KEY_PUSH_ID, sub.id);
          localStorage.setItem("onesignal_player_id", sub.id);
          return sub.id;
        }
      } catch (optErr) {
        console.warn("[OneSignal] optIn error:", optErr);
      }
    }

    // Wait briefly for OneSignal to resolve subscription if handshake is in progress
    const resolvedId = await new Promise<string>((resolve) => {
      let settled = false;

      const finish = (id: string) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        try {
          sdk.User?.PushSubscription?.removeEventListener?.("change", handler);
        } catch {}
        if (id) {
          localStorage.setItem(STORAGE_KEY_PUSH_ID, id);
          localStorage.setItem("onesignal_player_id", id);
        }
        resolve(id);
      };

      const timer = setTimeout(() => {
        const fallback = (sdk.User?.PushSubscription?.id && sdk.User?.PushSubscription?.optedIn)
          ? sdk.User.PushSubscription.id
          : "";
        finish(fallback);
      }, timeoutMs);

      const handler = (event: any) => {
        const currentSub = event?.current;
        if (currentSub?.id && currentSub?.optedIn) {
          finish(currentSub.id);
        }
      };

      try {
        sdk.User?.PushSubscription?.addEventListener?.("change", handler);
      } catch {
        finish("");
      }
    });

    return resolvedId || "";
  } catch (err) {
    console.warn("[OneSignal] Push subscription retrieval error:", err);
    return "";
  }
};

// Aliases for backward compatibility
export const getOneSignalPlayerId = getOneSignalPushSubscriptionId;
export const getStoredPlayerId = getStoredPushSubscriptionId;

// --------------------------------------------------
// 4. Request native notification permission (User action)
// --------------------------------------------------
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const OneSignal = await initializeOneSignal();
    if (!OneSignal) return false;

    if (!OneSignal.Notifications.permission) {
      await OneSignal.Notifications.requestPermission();
    }

    if (!OneSignal.Notifications.permission) {
      console.warn("[OneSignal] Notification permission not granted.");
      return false;
    }

    await OneSignal.User.PushSubscription.optIn();

    const subscription = OneSignal.User.PushSubscription;
    if (subscription?.id && subscription?.optedIn) {
      localStorage.setItem(STORAGE_KEY_PUSH_ID, subscription.id);
      localStorage.setItem("onesignal_player_id", subscription.id);
      console.log("[OneSignal] Push subscription registered:", subscription.id);
    }

    return Boolean(subscription?.id && subscription?.optedIn);
  } catch (error) {
    console.error("[OneSignal] Permission request failed:", error);
    return false;
  }
};

// --------------------------------------------------
// 5. Synchronize authenticated MongoDB user with OneSignal
// --------------------------------------------------
export const syncOneSignalUser = async (user: any): Promise<void> => {
  if (!user || typeof window === "undefined") return;

  // STRICT REQUIREMENT: Only use genuine database user ID
  // NEVER use username, email, or a fake fallback as an external ID
  const dbUserId =
    user?._id ||
    user?.id ||
    user?.userId ||
    user?.user?._id ||
    user?.user?.id;

  if (!dbUserId || typeof dbUserId !== "string" || !dbUserId.trim()) {
    console.warn("[OneSignal] Aborting sync: No valid database user ID provided.", user);
    return;
  }

  const cleanUserId = String(dbUserId).trim();

  const email =
    user?.email ||
    user?.userData?.email ||
    user?.user?.email ||
    "";

  const name =
    user?.name ||
    user?.username ||
    user?.userData?.name ||
    user?.user?.name ||
    "";

  const role =
    user?.role ||
    user?.accountType ||
    user?.user?.role ||
    "";

  console.log("[OneSignal] Syncing authenticated user to OneSignal:", {
    externalId: cleanUserId,
    email: email || undefined,
  });

  try {
    const OneSignal = await initializeOneSignal();
    if (!OneSignal) {
      console.warn("[OneSignal] SDK unavailable to sync user.");
      return;
    }

    // 1. Log in external user ID (MongoDB _id)
    await OneSignal.login(cleanUserId);
    console.log("[OneSignal] Logged in successfully with external ID:", cleanUserId);

    // 2. Add Email Subscription if available
    if (email && email.includes("@")) {
      try {
        if (typeof OneSignal.User?.addEmail === "function") {
          await OneSignal.User.addEmail(email.trim());
          console.log("[OneSignal] Added email subscription:", email.trim());
        }
      } catch (emailErr) {
        console.warn("[OneSignal] addEmail warning:", emailErr);
      }
    }

    // 3. Set tags for segmentation
    try {
      if (name && typeof OneSignal.User?.addTag === "function") {
        OneSignal.User.addTag("username", String(name));
      }
      if (role && typeof OneSignal.User?.addTag === "function") {
        OneSignal.User.addTag("role", String(role));
      }
    } catch (tagErr) {
      console.warn("[OneSignal] addTag warning:", tagErr);
    }

    // 4. Opt in push subscription if permission already granted
    try {
      if (
        OneSignal.Notifications?.permission &&
        typeof OneSignal.User?.PushSubscription?.optIn === "function"
      ) {
        await OneSignal.User.PushSubscription.optIn();
        console.log("[OneSignal] Push subscription opted in.");
      }
    } catch (optErr) {
      console.warn("[OneSignal] Push opt-in warning:", optErr);
    }

    // 5. Cache push subscription ID if active
    const pushSub = OneSignal.User?.PushSubscription;
    if (pushSub?.id && pushSub?.optedIn) {
      localStorage.setItem(STORAGE_KEY_PUSH_ID, pushSub.id);
      localStorage.setItem("onesignal_player_id", pushSub.id);
      console.log("[OneSignal] Stored push subscription ID:", pushSub.id);
    }
  } catch (error) {
    console.error("[OneSignal] User synchronization failed:", error);
  }
};

// --------------------------------------------------
// 6. Logout user from OneSignal
// --------------------------------------------------
export const oneSignalLogout = async (): Promise<void> => {
  if (typeof window === "undefined") return;
  try {
    const OneSignal = await initializeOneSignal();
    if (OneSignal?.logout) {
      await OneSignal.logout();
      console.log("[OneSignal] Logged out successfully.");
    }
  } catch (err) {
    console.warn("[OneSignal] Logout error:", err);
  } finally {
    localStorage.removeItem(STORAGE_KEY_PUSH_ID);
    localStorage.removeItem("onesignal_player_id");
  }
};

// --------------------------------------------------
// 7. Main Next.js OneSignal handler component
// --------------------------------------------------
export default function OneSignalHandler() {
  const { userData, loading } = useAuth();
  const lastUserIdRef = useRef<string | null>(null);

  // Initialize OneSignal once on mount
  useEffect(() => {
    let mounted = true;

    initializeOneSignal().then((sdk) => {
      if (!mounted || !sdk) return;

      console.log("[OneSignal] Client ready:", {
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
        permission: sdk.Notifications?.permission,
        pushSubscriptionId: (sdk.User?.PushSubscription?.id && sdk.User?.PushSubscription?.optedIn)
          ? sdk.User.PushSubscription.id
          : null,
        optedIn: sdk.User?.PushSubscription?.optedIn,
      });
    }).catch((err) => {
      console.warn("[OneSignal] Initialization error:", err);
    });

    return () => {
      mounted = false;
    };
  }, []);

  // Synchronize authenticated database user identity
  useEffect(() => {
    if (loading) return;

    const dbUserId =
      userData?._id ||
      userData?.user?.id ||
      (userData?.user as any)?._id;

    const sync = async () => {
      try {
        if (dbUserId) {
          const currentIdStr = String(dbUserId);
          if (lastUserIdRef.current === currentIdStr) {
            return;
          }
          await syncOneSignalUser(userData);
          lastUserIdRef.current = currentIdStr;
        } else if (lastUserIdRef.current) {
          await oneSignalLogout();
          lastUserIdRef.current = null;
        }
      } catch (error) {
        console.warn("[OneSignal] Authentication sync error:", error);
      }
    };

    sync();
  }, [userData, loading]);

  return null;
}

// --------------------------------------------------
// 8. Detect platform (ios | android | web)
// --------------------------------------------------
export const getPlatform = (): "ios" | "android" | "web" => {
  if (typeof window === "undefined") return "web";
  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera || "";
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return "ios";
  }
  if (/android/i.test(userAgent)) {
    return "android";
  }
  return "web";
};
