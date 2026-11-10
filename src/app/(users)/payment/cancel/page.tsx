"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  XCircle,
  ArrowLeft,
  RotateCcw,
  CreditCard,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";

const PaymentCancelPage = () => {
  const router = useRouter();

  return (
    <div className="w-full px-4 sm:px-6 py-10 sm:py-16 flex items-center justify-center">
      <div className="w-full max-w-lg">

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-[0_4px_24px_-4px_rgba(0,0,0,0.07)]">
          {/* Body */}
          <div className="px-6 sm:px-10 pt-8 pb-6 flex flex-col items-center text-center">

            {/* Icon ring */}
            <div className="relative mb-5">
              <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-500" strokeWidth={1.5} />
              </div>
              {/* Subtle pulse ring */}
              <div className="absolute inset-0 rounded-full border-2 border-red-200 animate-ping opacity-20" />
            </div>

            {/* Tag */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200/70 text-red-600 text-[11px] font-extrabold uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              Payment Cancelled
            </span>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl font-black text-[#053697] tracking-tight leading-tight">
              Your deposit was<br />not completed
            </h1>

            <p className="text-slate-500 text-sm sm:text-[15px] mt-3 leading-relaxed max-w-sm">
              You cancelled the payment before it was processed. No funds have been charged to your account.
            </p>

            {/* Divider */}
            <div className="w-full border-t border-slate-100 my-6" />

            {/* Info pills row */}
            <div className="flex flex-wrap items-center justify-center gap-2 w-full mb-7">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2FC191] shrink-0" />
                <span>No charge made</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600 text-xs font-semibold">
                <CreditCard className="w-3.5 h-3.5 text-[#053697] shrink-0" />
                <span>Balance unchanged</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full">
              {/* Primary — try again */}
              <Link
                href="/deposit"
                className="flex-1 h-11 sm:h-12 rounded-xl bg-[#053697] hover:bg-[#042870] text-white font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <RotateCcw className="w-4 h-4 shrink-0" />
                Try Again
              </Link>

              {/* Secondary — go home */}
              <Link
                href="/"
                className="flex-1 h-11 sm:h-12 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                Go Home
              </Link>
            </div>
          </div>

          {/* Footer strip */}
          <div className="px-6 sm:px-10 py-4 bg-slate-50/70 border-t border-slate-200/80 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400 font-medium">
              Need help?
            </span>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#053697] hover:text-[#042870] transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Contact Support
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentCancelPage;

