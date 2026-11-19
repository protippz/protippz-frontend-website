/**
 * Minimal typings for the OneSignal Web SDK v16 (page SDK loaded from the CDN).
 * Only the surface this app uses is declared.
 * Reference: https://documentation.onesignal.com/docs/web-sdk-reference
 */

export type NotificationPermissionState = "default" | "granted" | "denied";

export interface PushSubscriptionState {
  id: string | null | undefined;
  token: string | null | undefined;
  optedIn: boolean;
}

export interface PushSubscriptionChangeEvent {
  previous: PushSubscriptionState;
  current: PushSubscriptionState;
}

export interface OneSignalPushSubscription extends PushSubscriptionState {
  optIn(): Promise<void>;
  optOut(): Promise<void>;
  addEventListener(event: "change", listener: (event: PushSubscriptionChangeEvent) => void): void;
  removeEventListener(event: "change", listener: (event: PushSubscriptionChangeEvent) => void): void;
}

export interface OneSignalUser {
  onesignalId: string | null | undefined;
  externalId: string | null | undefined;
  PushSubscription: OneSignalPushSubscription;
  addEmail(email: string): void;
  addTags(tags: Record<string, string>): void;
}

export interface OneSignalNotifications {
  /** `true` when the browser permission is granted. */
  permission: boolean;
  permissionNative: NotificationPermissionState;
  isPushSupported(): boolean;
  requestPermission(): Promise<void>;
}

export interface OneSignalSlidedown {
  promptPush(options?: { force?: boolean }): Promise<void>;
}

export interface OneSignalSDK {
  init(options: OneSignalInitOptions): Promise<void>;
  login(externalId: string, jwtToken?: string): Promise<void>;
  logout(): Promise<void>;
  setConsentRequired?(required: boolean): Promise<void>;
  Debug?: { setLogLevel(level: "trace" | "debug" | "info" | "warn" | "error"): void };
  Notifications: OneSignalNotifications;
  Slidedown: OneSignalSlidedown;
  User: OneSignalUser;
}

export interface OneSignalInitOptions {
  appId: string;
  safari_web_id?: string;
  allowLocalhostAsSecureOrigin?: boolean;
  serviceWorkerPath?: string;
  serviceWorkerParam?: { scope: string };
  notifyButton?: { enable: boolean };
  welcomeNotification?: { disable?: boolean; title?: string; message?: string };
  promptOptions?: {
    slidedown?: {
      prompts: Array<{
        type: "push";
        autoPrompt: boolean;
        text?: { actionMessage?: string; acceptButton?: string; cancelButton?: string };
        delay?: { pageViews?: number; timeDelay?: number };
      }>;
    };
  };
}

declare global {
  interface Window {
    OneSignal?: OneSignalSDK;
    OneSignalDeferred?: Array<(OneSignal: OneSignalSDK) => void | Promise<void>>;
  }
}
