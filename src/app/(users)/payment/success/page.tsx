"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  ArrowRight,
  Wallet,
  ShieldCheck,
  Copy,
  Check,
  Receipt,
  Sparkles,
  HelpCircle,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import successImage from "@/Assets/success.jpg";
const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id") || "";
  const [copied, setCopied] = useState(false);

  const handleCopySessionId = async () => {
    if (!sessionId) return;
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopied(true);
      toast.success("Transaction Reference ID copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy Reference ID");
    }
  };

  // Truncate long session ID for elegant Mac-style display
  const shortSessionId = sessionId
    ? `${sessionId.slice(0, 10)}...${sessionId.slice(-8)}`
    : "Verified by Stripe";

  return (
    <div className="w-full px-4 sm:px-6 py-10 sm:py-16 flex items-center justify-center">
      <div className="w-full max-w-lg">
        {/* Main Mac-Style Card */}
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-[24px]">
          {/* Card Body */}
          <div className="px-6 sm:px-10 pt-8 pb-6 flex flex-col items-center text-center">
            {/* Animated Success Ring */}
            <Image
              src={successImage}
              alt="Deposit Successful"
              width={96}
              height={96}
              className="w-24 h-24 object-contain"
              priority
            />
            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl font-black text-[#053697] tracking-tight leading-tight">
              Funds successfully added to your wallet
            </h1>
            {/* Divider */}
            <div className="w-full border-t border-slate-100 my-6" />

            {/* Receipt Summary Box */}
            <div className="w-full rounded-2xl bg-slate-50/90 border border-slate-200/80 p-4 sm:p-5 text-left mb-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[#053697]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Payment Receipt
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              </div>

              <div className="pt-3 space-y-2.5 text-xs">
                {/* Reference ID */}
                {sessionId && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500 font-medium">Reference ID</span>
                    <button
                      type="button"
                      onClick={handleCopySessionId}
                      className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-800 bg-white hover:bg-slate-100 border border-slate-200/90 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                      title="Copy reference ID"
                    >
                      <span>{shortSessionId}</span>
                      {copied ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                  </div>
                )}

                {/* Payment Method */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Payment Method</span>
                  <div className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
                    <CreditCard className="w-3.5 h-3.5 text-[#053697]" />
                    <span>Stripe Checkout</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full">
              {/* Primary — Explore Playerz to Tip */}
              <Link
                href="/playerz"
                className="flex-1 h-11 sm:h-12 rounded-xl bg-[#053697] hover:bg-[#042870] text-white font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <span>Explore Playerz</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>

              {/* Secondary — View Transactions */}
              <Link
                href="/transaction-log"
                className="flex-1 h-11 sm:h-12 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <Wallet className="w-4 h-4 shrink-0 text-[#053697]" />
                <span>View Wallet</span>
              </Link>
            </div>
          </div>

          {/* Footer Strip */}
          <div className="px-6 sm:px-10 py-4 bg-slate-50/70 border-t border-slate-200/80 flex items-center justify-between gap-2">
            <Link
              href="/deposit"
              className="text-[11px] font-bold text-slate-600 hover:text-[#053697] transition-colors"
            >
              ← Deposit More Funds
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#053697] hover:text-[#042870] transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Support</span>
            </Link>
          </div>
        </div>

        {/* Subtext below card */}
        <p className="text-center text-xs text-slate-400 mt-5 font-medium">
          A receipt has been registered to your account. Need assistance?{" "}
          <Link
            href="/contact"
            className="text-[#053697] font-bold hover:underline"
          >
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
};

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-[#053697] animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
