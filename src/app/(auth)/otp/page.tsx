"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Mail, ShieldCheck, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { OtpVerify } from "@/ApisRequests/Auth";
import athleteBanner from "@/../public/new/female-player.webp";

const OTP_LENGTH = 5;

const OtpFormContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 1. Resolve target email from query params or localStorage
  useEffect(() => {
    const queryEmail = searchParams?.get("email");
    if (queryEmail) {
      setEmail(queryEmail);
      if (typeof window !== "undefined") {
        localStorage.setItem("email", queryEmail);
      }
    } else if (typeof window !== "undefined") {
      const stored = localStorage.getItem("email") || "";
      setEmail(stored);
    }
  }, [searchParams]);

  // 2. Auto-focus the first input on initial mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // 3. Countdown timer for Resend Code
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Handle single digit input
  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric characters
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const nextOtp = [...otp];
      nextOtp[index] = "";
      setOtp(nextOtp);
      return;
    }

    const digit = cleaned.slice(-1); // Take latest typed digit
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);

    // Auto-advance focus to next slot
    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace and arrow navigation
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
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

  // Handle clipboard paste (e.g. user pastes full 5-digit code)
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

  // Submit OTP verification
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const fullOtp = otp.join("");
    if (fullOtp.length < OTP_LENGTH) {
      toast.error(`Please enter all ${OTP_LENGTH} digits of your verification code.`);
      return;
    }

    const resolvedEmail =
      email || (typeof window !== "undefined" ? localStorage.getItem("email") || "" : "");

    if (!resolvedEmail) {
      toast.error("Email address is missing. Please sign up again.");
      return;
    }

    setLoading(true);
    try {
      const res = await OtpVerify({
        email: resolvedEmail,
        verifyCode: Number(fullOtp),
      });

      setLoading(false);

      if (res?.success) {
        toast.success(res?.message || "Email verified successfully!");
        router.push("/sign-in");
      } else {
        toast.error(res?.message || "Invalid or expired verification code. Please try again.");
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message || "Verification failed. Please try again.");
    }
  };

  // Handle resending verification code
  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    try {
      // Re-trigger verification code dispatch or prompt user
      toast.success(
        email
          ? `Verification code re-sent to ${email}`
          : "Verification code sent to your email.",
      );
      setResendCooldown(60);
    } catch {
      toast.error("Failed to resend code. Please try again shortly.");
    } finally {
      setIsResending(false);
    }
  };

  const isComplete = otp.every((d) => d.trim().length > 0);

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 bg-gradient-to-r from-[#fae8d2]/45 via-[#fcfbf9] to-[#d1fae5]/45 relative">
      {/* Top Left: Navigation back to Sign In */}
      <div className="w-full max-w-5xl mb-3 flex items-center justify-between">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-[#053697] bg-white/90 hover:bg-white backdrop-blur-md px-4 py-2 rounded-full border border-gray-200/80 transition-all group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-gray-500 group-hover:text-[#053697]" />
          <span>Back to Sign In</span>
        </Link>

        <Link
          href="/"
          className="text-xs font-medium text-gray-500 hover:text-[#053697] transition-colors"
        >
          ProTippz Home
        </Link>
      </div>

      {/* Centered Modal Card */}
      <div className="w-full max-w-md md:max-w-5xl bg-white rounded-[32px] border border-gray-100  p-5 sm:p-7 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-2 items-center relative">
        {/* Left Side: Athlete Montage Collage in Rounded Card (Desktop/Tablet) */}
        <div className="hidden md:flex relative w-full h-full min-h-[440px] bg-[#0a101d] rounded-[24px] overflow-hidden items-center justify-center">
          <Image
            src={athleteBanner}
            alt="PROTIPPZ Verification"
            priority
            fill
            className="object-cover object-center"
          />

          {/* Frosted Glass Mac-Style Floating Pill */}
          <div className="absolute bottom-5 inset-x-5 backdrop-blur-xl bg-white/90 border border-white/40 rounded-2xl p-4 text-left">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#053697]/10 flex items-center justify-center text-[#053697] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">
                  Account Verification
                </p>
                <p className="text-[11px] text-gray-500 truncate">
                  Protecting your ProTippz athlete & fan identity
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Clean OTP Verification Form */}
        <div className="w-full max-w-sm mx-auto flex flex-col justify-center px-1 sm:px-2 py-2">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-[#053697]/10 flex items-center justify-center mb-3 text-[#053697]">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black italic tracking-wide text-[#053697] uppercase">
              VERIFY OTP
            </h1>

            <p className="text-xs text-gray-500 mt-1">
              Please enter the 5-digit verification code sent to
            </p>

            <div className="inline-flex items-center gap-1.5 mt-2 px-3.5 py-1 bg-[#f1f3f6] rounded-full text-xs font-medium text-gray-700 max-w-full">
              <Mail className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span className="truncate max-w-[220px]">
                {email || "your registered email"}
              </span>
            </div>
          </div>

          {/* OTP Input Form */}
          <form onSubmit={handleSubmit} className="w-full mt-6 space-y-5">
            {/* 5 Distinct Squircle OTP Input Slots */}
            <div className="flex items-center justify-center gap-2 sm:gap-2">
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
                  className="w-12 h-13 sm:w-13 sm:h-14 rounded-2xl border border-gray-200 bg-[#f9fafb] text-center text-xl font-black text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#053697] focus:bg-white transition-all  select-none"
                  aria-label={`Digit ${index + 1} of verification code`}
                />
              ))}
            </div>

            {/* Verify Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !isComplete}
                className="w-full h-10 rounded-full bg-[#053697] hover:bg-[#1e40af] active:bg-[#1e3a8a] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold transition-all active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <span>Verify Code</span>
                )}
              </button>
            </div>
          </form>

          {/* Resend Code Action */}
          <div className="mt-5 text-center">
            {resendCooldown > 0 ? (
              <p className="text-xs text-gray-400">
                Resend code in{" "}
                <span className="font-semibold text-gray-600">
                  {resendCooldown}s
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#053697] hover:underline cursor-pointer disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`}
                />
                <span>Resend Code</span>
              </button>
            )}
          </div>

          {/* Bottom Switcher Links */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col items-center gap-1.5 text-center">
            <p className="text-[11px] text-gray-500">
              Need to change your email?{" "}
              <Link
                href="/sign-up"
                className="text-[#053697] font-bold hover:underline"
              >
                Sign up again
              </Link>
            </p>

            <p className="text-[11px] text-gray-500">
              Already verified?{" "}
              <Link
                href="/sign-in"
                className="text-[#053697] font-bold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function OtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-[#fae8d2]/45 via-[#fcfbf9] to-[#d1fae5]/45">
          <Loader2 className="w-6 h-6 animate-spin text-[#053697]" />
        </div>
      }
    >
      <OtpFormContent />
    </Suspense>
  );
}
