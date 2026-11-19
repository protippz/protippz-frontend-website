"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { Check, Info, LoaderCircle, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast, toastStore, type ToastItem, type ToastType } from "./store";

const ICONS: Record<ToastType, ReactNode> = {
  default: null,
  success: <Check className="h-3.5 w-3.5" strokeWidth={3} />,
  error: <X className="h-3.5 w-3.5" strokeWidth={3} />,
  info: <Info className="h-3.5 w-3.5" strokeWidth={2.75} />,
  warning: <TriangleAlert className="h-3.5 w-3.5" strokeWidth={2.75} />,
  loading: <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={2.5} />,
};

const CHIP: Record<ToastType, string> = {
  default: "bg-slate-100 text-slate-600",
  success: "bg-[#2FC191] text-white",
  error: "bg-rose-500 text-white",
  info: "bg-[#053697] text-white",
  warning: "bg-amber-400 text-white",
  loading: "bg-transparent text-[#053697]",
};

const BAR: Record<ToastType, string> = {
  default: "bg-slate-300",
  success: "bg-[#2FC191]",
  error: "bg-rose-500",
  info: "bg-[#053697]",
  warning: "bg-amber-400",
  loading: "bg-transparent",
};

function ToastCard({ item }: { item: ToastItem }) {
  const { id, type, message, description, icon, duration, visible, version } = item;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remaining = useRef(duration);
  const startedAt = useRef(0);
  const paused = useRef(false);
  const finite = Number.isFinite(duration);

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const start = () => {
    if (!finite || !visible) return;
    clear();
    startedAt.current = Date.now();
    timer.current = setTimeout(() => toast.dismiss(id), remaining.current);
  };

  // (Re)start the countdown whenever the toast is created or updated.
  useEffect(() => {
    remaining.current = duration;
    if (!paused.current) start();
    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, duration, visible]);

  const pause = () => {
    if (!finite || paused.current) return;
    paused.current = true;
    clear();
    remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt.current));
  };

  const resume = () => {
    if (!paused.current) return;
    paused.current = false;
    start();
  };

  const chipIcon = icon ?? ICONS[type];
  const isAlert = type === "error" || type === "warning";

  return (
    <div
      role={isAlert ? "alert" : "status"}
      aria-live={isAlert ? "assertive" : "polite"}
      aria-atomic="true"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      className={cn(
        "group pointer-events-auto relative w-full overflow-hidden rounded-[20px] border border-slate-200/80 bg-white/95 backdrop-blur-xl",
        "shadow-[0_10px_32px_-12px_rgba(5,54,151,0.22)]",
        "duration-200 motion-reduce:animate-none",
        visible
          ? "animate-in fade-in slide-in-from-top-3 zoom-in-95"
          : "animate-out fade-out slide-out-to-top-2 zoom-out-95 [animation-fill-mode:forwards]",
      )}
    >
      <div className="flex items-start gap-3 py-3 pl-3.5 pr-10">
        {chipIcon && (
          <span
            className={cn(
              "mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
              icon ? "bg-slate-100 text-slate-700" : CHIP[type],
            )}
            aria-hidden="true"
          >
            {chipIcon}
          </span>
        )}
        <div className="min-w-0 flex-1 pt-0.75">
          <div className="text-[13.5px] font-semibold leading-snug text-slate-800 wrap-break-word">
            {message}
          </div>
          {description && (
            <div className="mt-0.5 text-[12.5px] leading-snug text-slate-500 wrap-break-word">
              {description}
            </div>
          )}
        </div>
      </div>

      {type !== "loading" && (
        <button
          type="button"
          onClick={() => toast.dismiss(id)}
          aria-label="Dismiss notification"
          className="absolute right-2.5 top-2.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 active:scale-[0.94]"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      )}

      {finite && (
        <span
          key={version}
          aria-hidden="true"
          className={cn(
            "toast-progress absolute bottom-0 left-0 h-[2.5px] w-full origin-left opacity-70 motion-reduce:hidden group-hover:paused group-focus-within:paused",
            BAR[type],
          )}
          style={{ animationDuration: `${duration}ms` }}
        />
      )}
    </div>
  );
}

/** Mount once at the app root. */
export function Toaster() {
  const items = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getServerSnapshot,
  );

  return (
    <section
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-0 top-3 z-2147483000 flex flex-col items-center gap-2 px-4 sm:top-5"
    >
      {items.map((item) => (
        <div key={item.id} className="w-full max-w-95">
          <ToastCard item={item} />
        </div>
      ))}
    </section>
  );
}
