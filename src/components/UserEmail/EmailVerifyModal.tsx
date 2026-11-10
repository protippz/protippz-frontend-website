"use client";

import React, { useState } from "react";
import { Mail, ShieldCheck, ArrowRight, Loader2, X, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { post } from "@/ApisRequests/server";

interface EmailVerifyModalProps {
  setAddEmail: (email: string) => void;
  showModal: boolean;
  setShowModalOtp: (value: boolean) => void;
  setShowModal: (value: boolean) => void;
  showModaOtp?: boolean;
}

const EmailVerifyModal: React.FC<EmailVerifyModalProps> = ({
  setAddEmail,
  setShowModalOtp,
  setShowModal,
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Please sign in to verify your email");
      return;
    }

    setLoading(true);
    try {
      const result = await post(
        "/user/add-email-address",
        { email: trimmedEmail },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setLoading(false);

      if (result?.success) {
        toast.success(result?.message || "Verification code sent to your email!");
        setAddEmail(trimmedEmail);
        setShowModal(false);
        setShowModalOtp(true);
      } else {
        toast.error(
          result?.message || "Failed to send verification code. Please try again."
        );
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div
      className="relative bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.12)] animate-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={() => setShowModal(false)}
        className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        aria-label="Close modal"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Header */}
      <div className="text-left mb-6 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#053697] text-[11px] font-bold uppercase tracking-wider font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-[#053697]" />
          <span>Profile Verification</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-[#053697]/10 flex items-center justify-center text-[#053697] shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Add Your Email
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Connect your official email to secure your athlete account
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="space-y-1.5">
          <label
            htmlFor="verify-email-input"
            className="block text-[11px] font-bold uppercase tracking-wider text-slate-600"
          >
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-4 text-slate-400 pointer-events-none">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="verify-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="athlete@university.edu"
              disabled={loading}
              className="w-full h-12 pl-11 pr-4 rounded-2xl border border-slate-200 bg-slate-50/70 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#053697] focus:bg-white transition-all "
            />
          </div>
        </div>

        {/* Info callout */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-emerald-50 text-[#1f8763] flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-[#2FC191]" />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            We will send a 5-digit verification code to confirm ownership. This email will be used for tip receipts and critical account alerts.
          </p>
        </div>

        {/* Buttons */}
        <div className="pt-2 space-y-2.5">
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full h-11 sm:h-12 rounded-full bg-[#053697] hover:bg-[#042870] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Sending Code...</span>
              </>
            ) : (
              <>
                <span>Send Verification Code</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="w-full h-10 rounded-full text-slate-500 hover:text-slate-800 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Maybe Later
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailVerifyModal;
