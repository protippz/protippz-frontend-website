import type { ReactNode } from "react";

/**
 * Tiny, dependency-free toast store. Drop-in for the subset of the
 * react-hot-toast API this app uses:
 *
 *   toast("Saved")                      neutral
 *   toast.success / error / info / warning / loading
 *   toast.dismiss(id?)                  one toast, or all
 *   toast.promise(promise, { loading, success, error })
 *
 * Passing an `id` updates that toast in place (e.g. loading → success).
 * An identical message of the same type that is already showing is not
 * stacked again – its timer is simply restarted.
 */

export type ToastType = "default" | "success" | "error" | "info" | "warning" | "loading";

export interface ToastOptions {
  /** Reuse an id to update an existing toast instead of adding a new one. */
  id?: string;
  /** Milliseconds before auto-dismiss. `Infinity` keeps it until dismissed. */
  duration?: number;
  /** Optional secondary line. */
  description?: ReactNode;
  /** Overrides the type icon. */
  icon?: ReactNode;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  message: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  duration: number;
  /** false while the exit animation runs. */
  visible: boolean;
  /** Bumped on every update so the item restarts its timer. */
  version: number;
}

const DEFAULT_DURATION: Record<ToastType, number> = {
  default: 3500,
  success: 3000,
  info: 3500,
  warning: 4500,
  error: 4500,
  loading: Infinity,
};

const MAX_VISIBLE = 4;
export const EXIT_MS = 180;

type Listener = () => void;

let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();
let counter = 0;
const removalTimers = new Map<string, ReturnType<typeof setTimeout>>();

const emit = () => listeners.forEach((listener) => listener());

const set = (next: ToastItem[]) => {
  toasts = next;
  emit();
};

export const toastStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => toasts,
  getServerSnapshot: (): ToastItem[] => EMPTY,
};

const EMPTY: ToastItem[] = [];

function remove(id: string) {
  removalTimers.delete(id);
  set(toasts.filter((t) => t.id !== id));
}

function dismiss(id?: string) {
  const targets = toasts.filter((t) => t.visible && (id === undefined || t.id === id));
  if (!targets.length) return;
  const ids = new Set(targets.map((t) => t.id));
  set(toasts.map((t) => (ids.has(t.id) ? { ...t, visible: false } : t)));
  ids.forEach((tid) => {
    if (!removalTimers.has(tid)) removalTimers.set(tid, setTimeout(() => remove(tid), EXIT_MS));
  });
}

const sameMessage = (a: ReactNode, b: ReactNode) =>
  (typeof a === "string" || typeof a === "number") && a === b;

function show(type: ToastType, message: ReactNode, options: ToastOptions = {}): string {
  if (typeof window === "undefined") return "";
  if (message === undefined || message === null || message === "") return "";

  const existing =
    (options.id && toasts.find((t) => t.id === options.id)) ||
    toasts.find((t) => t.visible && t.type === type && sameMessage(t.message, message));

  if (existing) {
    const timer = removalTimers.get(existing.id);
    if (timer) {
      clearTimeout(timer);
      removalTimers.delete(existing.id);
    }
    const updated: ToastItem = {
      ...existing,
      type,
      message,
      description: options.description,
      icon: options.icon,
      duration: options.duration ?? DEFAULT_DURATION[type],
      visible: true,
      version: existing.version + 1,
    };
    set(toasts.map((t) => (t.id === existing.id ? updated : t)));
    return existing.id;
  }

  const id = options.id ?? `t${++counter}`;
  const item: ToastItem = {
    id,
    type,
    message,
    description: options.description,
    icon: options.icon,
    duration: options.duration ?? DEFAULT_DURATION[type],
    visible: true,
    version: 0,
  };
  set([...toasts, item]);

  // Keep the stack short: retire the oldest visible toasts.
  const visible = toasts.filter((t) => t.visible);
  if (visible.length > MAX_VISIBLE) {
    visible.slice(0, visible.length - MAX_VISIBLE).forEach((t) => dismiss(t.id));
  }
  return id;
}

type Message = ReactNode;
type PromiseMessage<T> = Message | ((value: T) => Message);

const resolveMessage = <T,>(message: PromiseMessage<T>, value: T): Message =>
  typeof message === "function" ? (message as (v: T) => Message)(value) : message;

function promise<T>(
  task: Promise<T>,
  messages: { loading: Message; success: PromiseMessage<T>; error: PromiseMessage<unknown> },
  options: ToastOptions = {},
): Promise<T> {
  const id = show("loading", messages.loading, options);
  task.then(
    (value) => show("success", resolveMessage(messages.success, value), { ...options, id }),
    (error) => show("error", resolveMessage(messages.error, error), { ...options, id }),
  );
  return task;
}

type ToastFn = ((message: Message, options?: ToastOptions) => string) & {
  success: (message: Message, options?: ToastOptions) => string;
  error: (message: Message, options?: ToastOptions) => string;
  info: (message: Message, options?: ToastOptions) => string;
  warning: (message: Message, options?: ToastOptions) => string;
  loading: (message: Message, options?: ToastOptions) => string;
  dismiss: (id?: string) => void;
  promise: typeof promise;
};

export const toast: ToastFn = Object.assign(
  (message: Message, options?: ToastOptions) => show("default", message, options),
  {
    success: (message: Message, options?: ToastOptions) => show("success", message, options),
    error: (message: Message, options?: ToastOptions) => show("error", message, options),
    info: (message: Message, options?: ToastOptions) => show("info", message, options),
    warning: (message: Message, options?: ToastOptions) => show("warning", message, options),
    loading: (message: Message, options?: ToastOptions) => show("loading", message, options),
    dismiss,
    promise,
  },
);
