"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ShieldCheck,
  Mail,
  Loader2,
  X,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { post } from "@/ApisRequests/server";

interface UserVerifyOtpProps {
  setShowModalOtp: (value: boolean) => void;
  addEmail: string;
}

const OTP_LENGTH = 5;

const UserVerifyOtp: React.FC<UserVerifyOtpProps> = ({
  setShowModalOtp,
  addEmail,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const nextOtp = [...otp];
      nextOtp[index] = "";
      setOtp(nextOtp);
      return;
    }

    const digit = cleaned.slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);

    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;

    const digits = pasted.slice(0, OTP_LENGTH).split("");
    const nextOtp = [...otp];
    digits.forEach((d, i) => {
      nextOtp[i] = d;
    });
    setOtp(nextOtp);

    const targetIndex = Math.min(digits.length, OTP_LENGTH) - 1;
    inputRefs.current[targetIndex]?.focus();
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const fullOtp = otp.join("");
    if (fullOtp.length < OTP_LENGTH) {
      toast.error(`Please enter all ${OTP_LENGTH} digits of your verification code`);
      return;
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Please sign in to complete verification");
      return;
    }

    setLoading(true);
    try {
      const result = await post(
        "/user/verify-add-email",
        {
          email: addEmail,
          verifyCode: Number(fullOtp),
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setLoading(false);

      if (result?.success) {
        toast.success(result?.message || "Email verified successfully!");
        setShowModalOtp(false);
        setTimeout(() => {
          window.location.reload();
        }, 600);
      } else {
        toast.error(
          result?.message || "Invalid or expired verification code. Please try again."
        );
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message || "Verification failed. Please try again.");
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    setResending(true);
    try {
      const result = await post(
        "/user/add-email-address",
        { email: addEmail },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setResending(false);
      if (result?.success) {
        toast.success(`Verification code re-sent to ${addEmail}`);
        setCountdown(60);
      } else {
        toast.error(result?.message || "Failed to resend verification code.");
      }
    } catch {
      setResending(false);
      toast.error("Failed to resend code. Please try again shortly.");
    }
  };

  const isComplete = otp.every((d) => d.trim().length > 0);

  return (
    <div
      className="relative bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.12)] animate-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={() => setShowModalOtp(false)}
        className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        aria-label="Close modal"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Header */}
      <div className="text-center mb-6 space-y-2">
        <div className="mx-auto w-12 h-12 rounded-md bg-[#053697]/10 flex items-center justify-center text-[#053697]">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Enter Verification Code
        </h3>

        <p className="text-xs text-slate-500">
          Enter the 5-digit verification code sent to
        </p>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700 max-w-full">
          <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate max-w-[240px]">{addEmail}</span>
        </div>
      </div>

      {/* OTP Inputs */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center justify-center gap-2.5">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-13 sm:w-13 sm:h-14 rounded-md border border-slate-200 bg-slate-50/70 text-center text-xl font-black text-slate-900 focus:outline-none focus:border-[#053697] focus:bg-white transition-all  select-none"
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || !isComplete}
            className="w-full h-11 sm:h-12 rounded-full bg-[#053697] hover:bg-[#042870] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Verifying Code...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Confirm</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Resend Action */}
      <div className="mt-5 text-center">
        {countdown > 0 ? (
          <p className="text-xs text-slate-400">
            Resend code in{" "}
            <span className="font-semibold text-slate-600">{countdown}s</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#053697] hover:underline cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`}
            />
            <span>Resend Code</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default UserVerifyOtp;
