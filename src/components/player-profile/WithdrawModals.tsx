"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Wallet,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ArrowRight,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Zap,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";
import { post } from "@/ApisRequests/server";
import achImg from "@/Assets/ach.png";

// ==========================================
// 1. STRIPE CONNECT MODAL (When isStripeConnected is false)
// ==========================================

interface StripeConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const StripeConnectModal: React.FC<StripeConnectModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [onboardingOpened, setOnboardingOpened] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setOnboardingOpened(false);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConnectStripe = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Please sign in to connect your payout account");
      return;
    }

    setLoading(true);
    try {
      const res = await post(
        "/stripe/connect-stripe",
        { test: "" },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setLoading(false);
      if (res?.success && res?.data) {
        toast.success("Opening secure Stripe portal...");
        window.open(res.data, "_blank");
        setOnboardingOpened(true);
      } else {
        toast.error(
          res?.message || "Failed to start Stripe setup. Please try again."
        );
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message || "An unexpected error occurred. Please try again.");
    }
  };

  const handleRefreshStatus = () => {
    toast.success("Refreshing connection status...");
    if (onSuccess) {
      onSuccess();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div
        className="relative bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-[28px] max-w-md w-full p-6 sm:p-7 z-10 shadow-[0_20px_60px_rgba(0,0,0,0.12)] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header */}
        <div className="text-left mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#053697] text-[11px] font-bold uppercase tracking-wider mb-3 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#053697]" />
            <span>Stripe Payouts</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-md bg-[#053697]/10 flex items-center justify-center text-[#053697] shrink-0">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Connect Bank Account
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Set up direct ACH deposits to withdraw your NIL earnings
              </p>
            </div>
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-3 mb-6 text-xs text-slate-600 leading-relaxed">
          <div className="p-3.5 bg-slate-50 rounded-md border border-slate-100 flex items-start gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-[#1f8763] flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-4 h-4 text-[#2FC191]" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Direct ACH Bank Transfers</p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Earnings are deposited directly to your bank checking account within 1-2 business days.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-md border border-slate-100 flex items-start gap-2">
            <div className="w-7 h-7 rounded-xl bg-blue-50 text-[#053697] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-[#053697]" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Bank-Grade Security</p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Encrypted via Stripe Connect. ProTippz never stores your raw account or routing numbers.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-md border border-slate-100 flex items-start gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="font-bold text-slate-900">NCAA & Tax Compliant</p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Seamless year-end 1099 tax reporting and official NIL payout tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {!onboardingOpened ? (
            <button
              type="button"
              onClick={handleConnectStripe}
              disabled={loading}
              className="w-full h-11 sm:h-12 rounded-full bg-[#053697] hover:bg-[#042870] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Connecting to Stripe...</span>
                </>
              ) : (
                <>
                  <span>Connect with Stripe</span>
                  <ExternalLink className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <div className="space-y-2.5">
              <div className="p-3 bg-blue-50/80 rounded-md border border-blue-100 text-xs text-[#053697] text-center font-medium">
                Stripe opened in a new tab. Complete your information, then click below to refresh.
              </div>

              <button
                type="button"
                onClick={handleRefreshStatus}
                className="w-full h-11 sm:h-12 rounded-full bg-[#2FC191] hover:bg-[#28b887] active:scale-[0.99] text-[#053697] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>I&apos;ve Completed Setup / Refresh</span>
              </button>

              <button
                type="button"
                onClick={handleConnectStripe}
                disabled={loading}
                className="w-full h-10 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Reopen Stripe Portal
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full h-10 rounded-full text-slate-500 hover:text-slate-800 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. WITHDRAW FUNDS MODAL (Only ACH via Stripe)
// ==========================================

interface WithdrawFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dueAmount: number;
  onWithdrawSuccess?: () => void;
  isStripeReady?: boolean;
}

export const WithdrawFundsModal: React.FC<WithdrawFundsModalProps> = ({
  isOpen,
  onClose,
  dueAmount,
  onWithdrawSuccess,
  isStripeReady,
}) => {
  const [amount, setAmount] = useState<number | string>(dueAmount || 0);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{
    amount: number;
  } | null>(null);

  // Bank account update required error state
  const [bankUpdateRequired, setBankUpdateRequired] = useState(
    isStripeReady === false
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setAmount(dueAmount || 0);
      setSuccessData(null);
      setBankUpdateRequired(isStripeReady === false);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, dueAmount, isStripeReady]);

  if (!isOpen) return null;

  const numericAmount = Number(amount) || 0;
  const isAmountValid = numericAmount > 0 && numericAmount <= (dueAmount || 0);

  // Quick preset chips
  const handlePreset = (preset: number) => {
    const clamped = Math.min(preset, dueAmount || 0);
    setAmount(clamped);
  };

  const handleWithdrawAll = () => {
    setAmount(dueAmount || 0);
  };

  // Handle ACH Withdrawal via Stripe
  const handleAchWithdraw = async () => {
    if (!isAmountValid) {
      if (numericAmount <= 0) toast.error("Please enter an amount greater than $0");
      else toast.error("Requested amount exceeds your available balance");
      return;
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Please sign in to withdraw funds");
      return;
    }

    setLoading(true);
    setBankUpdateRequired(false);

    try {
      const res = await post(
        "/withdraw/create",
        { amount: numericAmount },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setLoading(false);

      if (res?.success) {
        toast.success(res?.message || "Withdrawal request submitted successfully!");
        setSuccessData({ amount: numericAmount });
      } else if (
        res?.message === "Transfer failed update your bank info" ||
        res?.message?.toLowerCase().includes("update your bank")
      ) {
        setBankUpdateRequired(true);
        toast.error("Please update your bank details in Stripe to complete transfer.");
      } else {
        toast.error(res?.message || "Failed to process withdrawal. Please try again.");
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message || "Something went wrong. Please try again.");
    }
  };

  // Handle updating Stripe connected account
  const handleUpdateConnectedAccount = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Please sign in to update your Stripe account");
      return;
    }

    setLoading(true);
    try {
      const res = await post(
        "/stripe/update-connected-account",
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setLoading(false);
      const link = typeof res?.data === "string" ? res.data : res?.data?.link;
      if (res?.success && link) {
        toast.success("Opening Stripe portal to update your account...");
        window.open(link, "_blank");
        return;
      }

      // Fallback: If update-connected-account didn't return a link, try connect-stripe
      const connectRes = await post(
        "/stripe/connect-stripe",
        { test: "" },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (connectRes?.success && connectRes?.data) {
        toast.success("Opening Stripe onboarding portal...");
        window.open(connectRes.data, "_blank");
      } else {
        toast.error(res?.message || connectRes?.message || "Unable to open update link.");
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message || "Error opening Stripe update portal.");
    }
  };

  const handleFinishSuccess = () => {
    onClose();
    if (onWithdrawSuccess) {
      onWithdrawSuccess();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div
        className="relative bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-[28px] max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 z-10 shadow-[0_20px_60px_rgba(0,0,0,0.12)] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ================= SUCCESS STATE ================= */}
        {successData ? (
          <div className="py-6 px-2 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="relative mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-[#2FC191]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Withdrawal Submitted!
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Your request to withdraw{" "}
                <span className="font-bold text-[#053697]">
                  ${successData.amount.toFixed(2)}
                </span>{" "}
                via Direct ACH Transfer has been received and is being processed.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-md border border-slate-100 max-w-sm mx-auto text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between">
                <span>Withdrawal Amount:</span>
                <span className="font-bold text-slate-900">
                  ${successData.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payout Method:</span>
                <span className="font-semibold text-slate-800">
                  Direct ACH Bank Deposit
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Arrival:</span>
                <span className="font-bold text-emerald-600">
                  1-2 Business Days
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleFinishSuccess}
                className="w-full h-11 rounded-full bg-[#053697] hover:bg-[#042870] active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* ================= WITHDRAWAL FORM STATE ================= */
          <div className="space-y-5">
            {/* Header */}
            <div className="text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[#1f8763] text-[11px] font-bold uppercase tracking-wider mb-2 font-mono">
                <Wallet className="w-3.5 h-3.5 text-[#2FC191]" />
                <span>NIL Payout</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Withdraw Earnings
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Transfer your funds directly to your connected bank checking account
              </p>
            </div>

            {/* Available Balance Hero Card */}
            <div className="p-4 bg-gradient-to-r from-slate-900 via-[#053697] to-slate-900 rounded-[22px] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  Available Balance
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5">
                  ${Number(dueAmount || 0).toFixed(2)}
                </h2>
              </div>
              <div className="text-right">
                {isStripeReady === false ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>Action Required</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#2FC191] animate-pulse" />
                    <span>Stripe Active</span>
                  </span>
                )}
              </div>
            </div>

            {/* Bank / Stripe Update Warning Banner */}
            {(bankUpdateRequired || isStripeReady === false) && (
              <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-md text-left space-y-2">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">
                      Stripe Profile Requires Verification
                    </h4>
                    <p className="text-[11px] text-amber-800/90 mt-0.5 leading-relaxed">
                      Your Stripe account requires updated bank account or identity information before you can receive direct deposits.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleUpdateConnectedAccount}
                  disabled={loading}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Update in Stripe</span>
                </button>
              </div>
            )}

            {/* Amount Selection Section */}
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Withdrawal Amount
                </label>
                <button
                  type="button"
                  onClick={handleWithdrawAll}
                  className="text-[11px] font-bold text-[#053697] hover:underline cursor-pointer"
                >
                  Withdraw All (${Number(dueAmount || 0).toFixed(2)})
                </button>
              </div>

              {/* Amount Input */}
              <div className="relative flex items-center">
                <span className="absolute left-4 font-black text-lg text-slate-400 pointer-events-none">
                  $
                </span>
                <input
                  type="number"
                  step="any"
                  min="1"
                  max={dueAmount}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-12 pl-8 pr-4 rounded-md border border-slate-200 bg-slate-50/70 text-lg font-black text-slate-900 focus:outline-none focus:border-[#053697] focus:bg-white transition-all "
                />
              </div>

              {/* Preset Chips */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {[25, 50, 100, 250].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePreset(preset)}
                    disabled={preset > (dueAmount || 0)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${numericAmount === preset
                      ? "bg-[#053697] text-white border-[#053697]"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/80"
                      }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>

              {/* Amount Validation Message */}
              {numericAmount > (dueAmount || 0) && (
                <p className="text-[11px] font-semibold text-rose-500 pt-0.5">
                  Amount exceeds your current available balance (${Number(dueAmount || 0).toFixed(2)})
                </p>
              )}
            </div>

            {/* Payout Method Card (Direct ACH via Stripe) */}
            <div className="space-y-2 text-left">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Payout Method
              </label>

              <div className="p-3.5 rounded-md border border-[#053697] bg-blue-50/60 ring-1 ring-[#053697]/20 flex items-center justify-between text-left">
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      Bank Transfer
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Estimated arrival in 1-2 business days • Powered by Stripe
                  </p>
                </div>
              </div>
            </div>

            {/* Security note & submit button */}
            <div className="space-y-3.5 pt-1">
              <div className="p-3.5 bg-slate-50 rounded-md border border-slate-100 text-xs text-slate-600 flex items-center gap-2.5 text-left">
                <ShieldCheck className="w-5 h-5 text-[#2FC191] shrink-0" />
                <span>
                  Transfers are encrypted and processed through your Stripe-connected checking account.
                </span>
              </div>

              <button
                type="button"
                onClick={handleAchWithdraw}
                disabled={loading || !isAmountValid}
                className="w-full h-11 sm:h-12 rounded-full bg-[#053697] hover:bg-[#042870] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Processing Transfer...</span>
                  </>
                ) : (
                  <>
                    <span>Withdraw ${numericAmount.toFixed(2)} to Bank</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
