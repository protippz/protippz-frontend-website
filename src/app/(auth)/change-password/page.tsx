"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { post } from "@/ApisRequests/server";
import toast from "react-hot-toast";
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";

const ChangePasswordPage: React.FC = () => {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // Password requirements calculation
  const hasMinLength = newPassword.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const passwordsMatch =
    newPassword.length > 0 && newPassword === confirmNewPassword;

  // Strength score: 0 to 3
  const strengthScore = useMemo(() => {
    let score = 0;
    if (newPassword.length >= 6) score++;
    if (newPassword.length >= 8 && hasLetter && hasNumber) score++;
    if (/[^a-zA-Z0-9]/.test(newPassword) && newPassword.length >= 8) score++;
    return score;
  }, [newPassword, hasLetter, hasNumber]);

  const strengthLabel = useMemo(() => {
    if (!newPassword) return "";
    if (strengthScore <= 1) return "Weak";
    if (strengthScore === 2) return "Good";
    return "Strong";
  }, [newPassword, strengthScore]);

  const strengthColor = useMemo(() => {
    if (strengthScore <= 1) return "bg-rose-500 text-rose-600";
    if (strengthScore === 2) return "bg-amber-500 text-amber-600";
    return "bg-emerald-500 text-emerald-600";
  }, [strengthScore]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword) {
      toast.error("Please enter your current password");
      return;
    }

    if (!newPassword) {
      toast.error("Please enter your new password");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword === oldPassword) {
      toast.error("New password cannot be the same as your current password");
      return;
    }

    const token =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("token")
        : null;

    if (!token) {
      toast.error("Please log in to change your password");
      router.push("/sign-in");
      return;
    }

    setLoading(true);
    try {
      const res = await post(
        "/auth/change-password",
        {
          oldPassword,
          newPassword,
          confirmNewPassword,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (res?.success) {
        toast.success(res?.message || "Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setTimeout(() => {
          router.push("/settings");
        }, 1200);
      } else {
        toast.error(res?.message || "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 bg-gradient-to-r from-[#fae8d2]/35 via-[#fcfbf9] to-[#d1fae5]/35 relative">
      {/* Top Navigation Bar */}
      <div className="w-full max-w-xl mb-4 flex items-center justify-between">
        <Link
          href="/settings"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-[#053697] bg-white/90 hover:bg-white backdrop-blur-md px-4 py-2 rounded-full border border-slate-200/80 shadow-2xs hover:shadow transition-all group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-slate-500 group-hover:text-[#053697]" />
          <span>Back to Settings</span>
        </Link>
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200/90 shadow-[0_12px_45px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-[#053697] via-[#0845bc] to-[#053697] text-white p-6 sm:p-8">
          <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute right-10 top-2 w-28 h-28 rounded-full bg-[#2FC191]/15 blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              Change Password
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-1.5 max-w-md leading-relaxed">
              Update your account password to keep your ProTippz profile, wallet balance, and fan activity safe.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {/* Current Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                Current Password
              </label>
              <Link
                href="/forget-password"
                className="text-[11px] font-bold text-[#053697] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:border-[#053697] focus:ring-2 focus:ring-[#053697]/15 outline-none text-slate-900 text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                title={showOldPassword ? "Hide password" : "Show password"}
              >
                {showOldPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                New Password
              </label>
              {strengthLabel && (
                <span
                  className={`text-[11px] font-black uppercase tracking-wider ${
                    strengthScore <= 1
                      ? "text-rose-600"
                      : strengthScore === 2
                      ? "text-amber-600"
                      : "text-emerald-600"
                  }`}
                >
                  Strength: {strengthLabel}
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new strong password"
                className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:border-[#053697] focus:ring-2 focus:ring-[#053697]/15 outline-none text-slate-900 text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                title={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Password Strength Meter */}
            {newPassword.length > 0 && (
              <div className="mt-2 flex items-center gap-1.5">
                <div
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    strengthScore >= 1 ? strengthColor.split(" ")[0] : "bg-slate-200"
                  }`}
                />
                <div
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    strengthScore >= 2 ? strengthColor.split(" ")[0] : "bg-slate-200"
                  }`}
                />
                <div
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    strengthScore >= 3 ? strengthColor.split(" ")[0] : "bg-slate-200"
                  }`}
                />
              </div>
            )}
          </div>

          {/* Confirm New Password Field */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Retype your new password"
                className={`w-full h-11 pl-10 pr-10 rounded-xl border bg-slate-50 hover:bg-white focus:bg-white focus:ring-2 outline-none text-slate-900 text-sm transition-all ${
                  confirmNewPassword.length > 0
                    ? passwordsMatch
                      ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/15"
                      : "border-rose-400 focus:border-rose-500 focus:ring-rose-500/15"
                    : "border-slate-200 focus:border-[#053697] focus:ring-[#053697]/15"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {confirmNewPassword.length > 0 && !passwordsMatch && (
              <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>Passwords do not match</span>
              </p>
            )}
          </div>

          {/* Password Requirements Checklist */}
          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 text-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Password Guidelines
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div
                className={`flex items-center gap-1.5 font-medium ${
                  hasMinLength ? "text-emerald-600" : "text-slate-500"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                    hasMinLength
                      ? "bg-emerald-100 text-emerald-700 font-bold"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  ✓
                </div>
                <span>At least 6 characters</span>
              </div>

              <div
                className={`flex items-center gap-1.5 font-medium ${
                  hasLetter && hasNumber ? "text-emerald-600" : "text-slate-500"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                    hasLetter && hasNumber
                      ? "bg-emerald-100 text-emerald-700 font-bold"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  ✓
                </div>
                <span>Letters and numbers</span>
              </div>

              <div
                className={`flex items-center gap-1.5 font-medium sm:col-span-2 ${
                  passwordsMatch ? "text-emerald-600" : "text-slate-500"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                    passwordsMatch
                      ? "bg-emerald-100 text-emerald-700 font-bold"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  ✓
                </div>
                <span>Passwords match</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/settings"
              className="w-full sm:w-auto px-6 h-12 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider flex items-center justify-center transition-colors cursor-pointer"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading || !hasMinLength || !passwordsMatch || !oldPassword}
              className="w-full sm:flex-1 h-12 rounded-xl bg-[#053697] hover:bg-[#042873] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <span>Save New Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
