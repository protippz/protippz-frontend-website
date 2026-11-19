"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Info, LogIn, ShieldAlert, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Promise-based confirmation dialog (replaces SweetAlert2).
 *
 *   if (await confirmDialog({ title: "Delete post?", tone: "danger" })) { ... }
 *
 * Resolves `true` on confirm, `false` on cancel / Escape / backdrop click.
 * Mount <ConfirmDialogHost /> once at the app root.
 */

export type ConfirmTone = "info" | "warning" | "danger" | "login";

export interface ConfirmOptions {
  title: ReactNode;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  tone?: ConfirmTone;
  /** Hide the cancel button (simple alert). */
  hideCancel?: boolean;
}

interface DialogState extends ConfirmOptions {
  key: number;
  resolve: (value: boolean) => void;
}

let current: DialogState | null = null;
let seq = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const store = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => current,
  getServerSnapshot: () => null,
};

function close(result: boolean) {
  if (!current) return;
  const { resolve } = current;
  current = null;
  emit();
  resolve(result);
}

export function confirmDialog(options: ConfirmOptions): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  // Only one dialog at a time – a new request cancels the previous one.
  if (current) close(false);
  return new Promise<boolean>((resolve) => {
    current = { ...options, key: ++seq, resolve };
    emit();
  });
}

const TONES: Record<ConfirmTone, { icon: ReactNode; chip: string; confirm: string }> = {
  info: {
    icon: <Info className="h-6 w-6" strokeWidth={2.25} />,
    chip: "bg-[#053697]/10 text-[#053697]",
    confirm: "bg-[#053697] hover:bg-[#042873] focus-visible:ring-[#053697]/30",
  },
  login: {
    icon: <LogIn className="h-6 w-6" strokeWidth={2.25} />,
    chip: "bg-[#053697]/10 text-[#053697]",
    confirm: "bg-[#053697] hover:bg-[#042873] focus-visible:ring-[#053697]/30",
  },
  warning: {
    icon: <TriangleAlert className="h-6 w-6" strokeWidth={2.25} />,
    chip: "bg-amber-100 text-amber-600",
    confirm: "bg-[#053697] hover:bg-[#042873] focus-visible:ring-[#053697]/30",
  },
  danger: {
    icon: <ShieldAlert className="h-6 w-6" strokeWidth={2.25} />,
    chip: "bg-rose-100 text-rose-600",
    confirm: "bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-500/30",
  },
};

export function ConfirmDialogHost() {
  const dialog = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dialog) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    confirmRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(false);
        return;
      }
      // Keep keyboard focus inside the dialog.
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>("button");
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [dialog]);

  if (!dialog) return null;

  const tone = TONES[dialog.tone ?? "info"];
  const titleId = `confirm-title-${dialog.key}`;
  const descId = `confirm-desc-${dialog.key}`;

  return createPortal(
    <div className="fixed inset-0 z-2147482000 flex items-end justify-center p-4 sm:items-center">
      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200 motion-reduce:animate-none"
        onClick={() => close(false)}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={dialog.description ? descId : undefined}
        className="relative w-full max-w-sm rounded-[28px] border border-slate-200/90 bg-white/95 p-6 text-center backdrop-blur-xl animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-200 motion-reduce:animate-none sm:slide-in-from-bottom-0"
      >
        <div className={cn("mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl", tone.chip)}>
          {tone.icon}
        </div>
        <h2 id={titleId} className="text-lg font-bold tracking-tight text-slate-900">
          {dialog.title}
        </h2>
        {dialog.description && (
          <p id={descId} className="mt-1.5 text-sm leading-relaxed text-slate-500">
            {dialog.description}
          </p>
        )}

        <div className={cn("mt-6 grid gap-2.5", dialog.hideCancel ? "grid-cols-1" : "grid-cols-2")}>
          {!dialog.hideCancel && (
            <button
              type="button"
              onClick={() => close(false)}
              className="h-11 cursor-pointer rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300/40 active:scale-[0.98]"
            >
              {dialog.cancelText ?? "Cancel"}
            </button>
          )}
          <button
            ref={confirmRef}
            type="button"
            onClick={() => close(true)}
            className={cn(
              "h-11 cursor-pointer rounded-xl text-sm font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-4 active:scale-[0.98]",
              tone.confirm,
            )}
          >
            {dialog.confirmText ?? "OK"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
