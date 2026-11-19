import type { OneSignalInitOptions } from "./types";

/**
 * OneSignal configuration.
 *
 * Env:
 *   NEXT_PUBLIC_ONESIGNAL_APP_ID          (required – push is disabled without it)
 *   NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID   (optional – legacy Safari < 16 support)
 *   NEXT_PUBLIC_ONESIGNAL_DEBUG=true      (optional – verbose SDK + app logging)
 */

export const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID ?? "";
const SAFARI_WEB_ID = process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID ?? "";

export const IS_DEV = process.env.NODE_ENV !== "production";
export const ONESIGNAL_DEBUG = IS_DEV || process.env.NEXT_PUBLIC_ONESIGNAL_DEBUG === "true";

export const ONESIGNAL_SDK_URL = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
export const ONESIGNAL_SCRIPT_ID = "onesignal-sdk-script";

/**
 * IMPORTANT: do not change the worker path or scope. Existing subscribers are
 * bound to this service-worker registration; changing it orphans them.
 * `public/OneSignalSDK.sw.js` is kept for subscribers from the legacy v15 path.
 */
const SERVICE_WORKER_PATH = "/OneSignalSDKWorker.js";
const SERVICE_WORKER_SCOPE = "/";

/** Timeouts (ms) so auth flows are never blocked by a slow / blocked SDK. */
export const TIMEOUTS = {
  /** Max wait for the SDK in user-facing flows (login, sign-up). */
  ready: 4000,
  /** Max wait for a push subscription id to resolve. */
  subscriptionId: 1500,
  /** Max wait when logging out before navigating away. */
  logout: 1500,
} as const;

/**
 * Slidedown prompt. Prompting on the very first page view gets sites demoted to
 * Chrome's "quiet" permission UI and lowers opt-in rates, so we wait until the
 * visitor has shown some engagement. OneSignal also backs off automatically
 * after a visitor dismisses the prompt.
 */
const PROMPT_DELAY = { pageViews: 2, timeDelay: 10 } as const;

export const buildInitOptions = (): OneSignalInitOptions => ({
  appId: ONESIGNAL_APP_ID,
  ...(SAFARI_WEB_ID ? { safari_web_id: SAFARI_WEB_ID } : {}),
  allowLocalhostAsSecureOrigin: IS_DEV,
  serviceWorkerPath: SERVICE_WORKER_PATH,
  serviceWorkerParam: { scope: SERVICE_WORKER_SCOPE },
  notifyButton: { enable: false },
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
          delay: PROMPT_DELAY,
        },
      ],
    },
  },
});
