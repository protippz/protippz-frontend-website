"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Lock, KeyRound, ArrowLeft, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { post } from "@/ApisRequests/server";
import athleteBanner from "@/../public/new/female-player.webp";

const ResetPasswordFormContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Retrieve email from URL search params or localStorage
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password) {
      toast.error("Please enter your new password");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (!confirmPassword) {
      toast.error("Please confirm your new password");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please re-enter.");
      return;
    }

    const resolvedEmail =
      email ||
      (typeof window !== "undefined" ? localStorage.getItem("email") || "" : "");

    setLoading(true);
    try {
      const payload = {
        password,
        confirmPassword,
        email: resolvedEmail,
      };

      const res = await post("/auth/reset-password", payload);
      setLoading(false);

      if (res?.success) {
        toast.success(res?.message || "Password reset successfully! Please sign in.");
        // Clear reset email from local storage
        if (typeof window !== "undefined") {
          localStorage.removeItem("email");
        }
        router.push("/sign-in");
      } else {
        toast.error(res?.message || "Failed to reset password. Please try again.");
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message || "An unexpected error occurred. Please try again.");
    }
  };

  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

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
            alt="PROTIPPZ Security"
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
                  Account Protection
                </p>
                <p className="text-[11px] text-gray-500 truncate">
                  Create a strong, secure password for your ProTippz account
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Reset Password Form */}
        <div className="w-full max-w-sm mx-auto flex flex-col justify-center px-1 sm:px-2 py-2">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-[#053697]/10 flex items-center justify-center mb-3 text-[#053697]">
              <KeyRound className="w-6 h-6" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black italic tracking-wide text-[#053697] uppercase">
              NEW PASSWORD
            </h1>

            <p className="text-xs text-gray-500 mt-1">
              Please enter and confirm your new password below
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full mt-6 space-y-3.5">
            {/* New Password */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-600 px-1">
                New Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full h-10 pl-9 pr-9 rounded-full border border-gray-200 bg-[#f9fafb] text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#053697] focus:bg-white transition-all "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEyeSlash className="w-3.5 h-3.5" />
                  ) : (
                    <FaEye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-600 px-1">
                Confirm New Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className={`w-full h-10 pl-9 pr-9 rounded-full border bg-[#f9fafb] text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white transition-all  ${passwordsMatch
                    ? "border-emerald-400 focus:border-emerald-500"
                    : "border-gray-200 focus:border-[#053697]"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="w-3.5 h-3.5" />
                  ) : (
                    <FaEye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Match Indicator */}
            {confirmPassword.length > 0 && (
              <div className="flex items-center gap-1.5 px-2 text-[11px]">
                {passwordsMatch ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-emerald-600 font-medium">
                      Passwords match
                    </span>
                  </>
                ) : (
                  <span className="text-amber-600 font-medium">
                    Passwords do not match yet
                  </span>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading || !password || !confirmPassword}
                className="w-full h-10 rounded-full bg-[#053697] hover:bg-[#1e40af] active:bg-[#1e3a8a] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold transition-all active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <span>Set New Password</span>
                )}
              </button>
            </div>
          </form>

          {/* Bottom Switcher */}
          <p className="text-[11px] text-gray-500 text-center mt-5">
            Remember your password?{" "}
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
  );
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-[#fae8d2]/45 via-[#fcfbf9] to-[#d1fae5]/45">
          <Loader2 className="w-6 h-6 animate-spin text-[#053697]" />
        </div>
      }
    >
      <ResetPasswordFormContent />
    </Suspense>
  );
}
