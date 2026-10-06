"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/provider/ContextProvider";

declare global {
  interface Window {
    OneSignalDeferred?: Array<(OneSignal: any) => void | Promise<void>>;
    OneSignal?: any;
  }
}

/**
 * Helper function to manually request push notification permission from anywhere in the UI.
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal: any) => {
      try {
        const permission = await OneSignal.Notifications.requestPermission();
        if (permission) {
          await OneSignal.User?.PushSubscription?.optIn();
        }
        resolve(permission);
      } catch {
        resolve(false);
      }
    });
  });
};

export default function OneSignalHandler() {
  const { userData, loading } = useAuth();
  const isInitializedRef = useRef<boolean>(false);
  const lastUserIdRef = useRef<string | null>(null);

  // 1. Initialize OneSignal on mount
  useEffect(() => {
    if (typeof window === "undefined" || isInitializedRef.current) return;
    isInitializedRef.current = true;

    const appId =
      process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID ||
      process.env.NEXT_PUSH_NOTIFICATION ||
      "";

    if (!appId) return;

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal: any) => {
      try {
        await OneSignal.init({
          appId,
          safari_web_id: process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID,
          allowLocalhostAsSecureOrigin: true,
          notifyButton: {
            enable: false,
          },
        });

        // Listen for foreground notifications to display while tab is active
        OneSignal.Notifications?.addEventListener(
          "foregroundWillDisplay",
          (event: any) => {
            if (event?.notification?.display) {
              event.notification.display();
            }
          },
        );

        // If permission is already granted, ensure opted in
        if (OneSignal.Notifications?.permission) {
          await OneSignal.User?.PushSubscription?.optIn();
        } else {
          try {
            await OneSignal.Slidedown?.promptPush({ force: true });
          } catch {}
        }
      } catch {}
    });
  }, []);

  // 2. Sync user login & identity with OneSignal
  useEffect(() => {
    if (loading || typeof window === "undefined") return;

    const userId =
      userData?._id ||
      (userData as any)?.id ||
      userData?.user?.email ||
      userData?.email;

    window.OneSignalDeferred = window.OneSignalDeferred || [];

    if (userId) {
      if (lastUserIdRef.current !== userId) {
        lastUserIdRef.current = userId;

        window.OneSignalDeferred.push(async (OneSignal: any) => {
          try {
            await OneSignal.login(userId);

            if (userData?.email) {
              await OneSignal.User?.addEmail(userData.email);
            }
            if (userData?.name || userData?.username) {
              await OneSignal.User?.addTag(
                "username",
                userData.username || userData.name,
              );
            }

            if (OneSignal.Notifications?.permission) {
              await OneSignal.User?.PushSubscription?.optIn();
            }
          } catch {}
        });
      }
    } else if (lastUserIdRef.current && !userData) {
      lastUserIdRef.current = null;
      window.OneSignalDeferred.push(async (OneSignal: any) => {
        try {
          await OneSignal.logout();
        } catch {}
      });
    }
  }, [userData, loading]);

  return null;
}
