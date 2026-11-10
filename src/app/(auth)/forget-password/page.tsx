"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, KeyRound, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { post } from "@/ApisRequests/server";
import athleteBanner from "@/../public/new/female-player.webp";

const ForgetPasswordFormContent: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error("Please enter your registered email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await post("/auth/forget-password", { email: trimmedEmail }, {});
      setLoading(false);

      if (res?.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("email", trimmedEmail);
        }
        toast.success(res?.message || "Verification code sent to your email!");
        router.push(`/forget-otp?email=${encodeURIComponent(trimmedEmail)}`);
      } else {
        toast.error(res?.message || "Unable to send reset code. Please check your email.");
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message || "Something went wrong. Please try again.");
    }
  };

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
            alt="PROTIPPZ Account Recovery"
            priority
            fill
            className="object-cover object-center"
          />

          {/* Frosted Glass Floating Badge */}
          <div className="absolute bottom-5 inset-x-5 backdrop-blur-xl bg-white/90 border border-white/40 rounded-2xl p-4 text-left">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#053697]/10 flex items-center justify-center text-[#053697] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">
                  Account Recovery
                </p>
                <p className="text-[11px] text-gray-500 truncate">
                  Secure password reset for your ProTippz account
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Forget Password Form */}
        <div className="w-full max-w-sm mx-auto flex flex-col justify-center px-1 sm:px-2 py-2">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-[#053697]/10 flex items-center justify-center mb-3 text-[#053697]">
              <KeyRound className="w-6 h-6" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black italic tracking-wide text-[#053697] uppercase">
              FORGOT PASSWORD?
            </h1>

            <p className="text-xs text-gray-500 mt-1 max-w-[280px] mx-auto leading-relaxed">
              Enter your registered email address and we&apos;ll send you a verification code to reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full mt-6 space-y-4">
            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-600 px-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  autoComplete="email"
                  className="w-full h-10 pl-9 pr-4 rounded-full border border-gray-200 bg-[#f9fafb] text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#053697] focus:bg-white transition-all "
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full h-10 rounded-full bg-[#053697] hover:bg-[#1e40af] active:bg-[#1e3a8a] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold transition-all active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <span>Send Reset Code</span>
                )}
              </button>
            </div>
          </form>

          {/* Bottom Switcher Links */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col items-center gap-1.5 text-center">
            <p className="text-[11px] text-gray-500">
              Remember your password?{" "}
              <Link
                href="/sign-in"
                className="text-[#053697] font-bold hover:underline"
              >
                Sign in
              </Link>
            </p>

            <p className="text-[11px] text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="text-[#053697] font-bold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ForgetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-[#fae8d2]/45 via-[#fcfbf9] to-[#d1fae5]/45">
          <Loader2 className="w-6 h-6 animate-spin text-[#053697]" />
        </div>
      }
    >
      <ForgetPasswordFormContent />
    </Suspense>
  );
}
