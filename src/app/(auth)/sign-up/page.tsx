"use client";

import React, { useState, useEffect, Suspense } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa6";
import { Mail, Lock, User, Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signUpHandler } from "@/ApisRequests/Auth";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import { post } from "@/ApisRequests/server";
import fanBanner from "@/../public/new/fanbase.png";
import athleteBanner from "@/../public/new/female-player.webp";

type AccountType = "fan" | "athlete";

const SignUpFormContent: React.FC = () => {
  const [accountType, setAccountType] = useState<AccountType>("fan");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [invite, setInvite] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Read and react to accountType and invite token from URL searchParams
  useEffect(() => {
    if (!searchParams) return;
    const urlRole =
      searchParams.get("role") ||
      searchParams.get("type") ||
      searchParams.get("accountType");

    if (urlRole) {
      const normalized = urlRole.toLowerCase();
      if (
        normalized === "athlete" ||
        normalized === "sportsperson" ||
        normalized === "player"
      ) {
        setAccountType("athlete");
      } else if (normalized === "fan" || normalized === "user") {
        setAccountType("fan");
      }
    }

    const inviteToken = searchParams.get("invite");
    if (inviteToken) {
      setInvite(inviteToken);
    }
  }, [searchParams]);

  // Google 1-Click Login / Signup
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${tokenResponse?.access_token}`,
            },
          },
        );

        if (!response.ok) {
          toast.error("Failed to fetch Google user info");
          return;
        }

        const userDetails = await response.json();
        const data = {
          name: userDetails.name || "",
          picture: userDetails.picture || "",
          email: userDetails.email || "",
          username:
            userDetails.email?.split("@")[0] ||
            userDetails.name ||
            (accountType === "athlete" ? "athlete" : "fan"),
          address: userDetails?.address || "",
          phone:
            userDetails?.phone ||
            userDetails?.phoneNumber ||
            userDetails?.phone_number ||
            "",
          role: accountType === "athlete" ? "player" : "user",
          accountType,
        };

        const res = await post("/auth/google-login", data);
        if (res?.success) {
          Cookies.remove("token");
          localStorage.setItem("token", res?.data?.accessToken);
          Cookies.set("token", res?.data?.accessToken);
          localStorage.setItem("accountType", accountType);
          toast.success(res?.message || "Signed up successfully!");
          window.location.href = accountType === "athlete" ? "/home" : "/";
        } else {
          toast.error(
            res?.message || "Authentication failed. Please try again.",
          );
        }
      } catch (error) {
        console.error("Google login error:", error);
        toast.error("Google sign up failed. Please try standard sign up.");
      }
    },
    onError: () => {
      toast.error("Google sign in was cancelled or failed.");
    },
  });

  // Streamlined Email Sign Up
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!termsAccepted) {
      toast.error("Please agree to the Terms of Service");
      return;
    }

    setFormLoading(true);

    const emailPrefix =
      email
        .trim()
        .split("@")[0]
        ?.replace(/[^a-zA-Z0-9_]/g, "") ||
      (accountType === "athlete" ? "athlete" : "fan");
    const derivedUsername =
      emailPrefix || `${accountType}_${Math.floor(Math.random() * 10000)}`;

    const targetRole = accountType === "athlete" ? "player" : "user";

    const data = {
      password,
      confirmPassword: password,
      userData: {
        name: fullName.trim(),
        username: derivedUsername,
        phone: "",
        email: email.trim(),
        address: "",
        role: targetRole,
        accountType,
        inviteToken: invite || "",
      },
    };

    try {
      const res = await signUpHandler(data);
      setFormLoading(false);

      if (res?.success) {
        localStorage.setItem("email", email.trim());
        localStorage.setItem("accountType", accountType);
        toast.success(
          res?.message || "Account created! Please check your email.",
        );
        router.push("/otp");
      } else {
        if (
          res?.message?.toLowerCase()?.includes("already exists") ||
          res?.message?.toLowerCase()?.includes("registered")
        ) {
          toast.error("This email is already registered. Please sign in.");
        } else {
          toast.error(res?.message || "Sign up failed. Please try again.");
        }
      }
    } catch (err: any) {
      setFormLoading(false);
      toast.error(err?.message || "Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 bg-gradient-to-r from-[#fae8d2]/45 via-[#fcfbf9] to-[#d1fae5]/45 relative">
      {/* Top Left: Back to Home Button */}
      <div className="w-full max-w-5xl mb-3 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-[#053697] bg-white/90 hover:bg-white backdrop-blur-md px-4 py-2 rounded-full border border-gray-200/80 shadow-sm hover:shadow transition-all group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-gray-500 group-hover:text-[#053697]" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Centered Modal Card */}
      <div className="w-full max-w-md md:max-w-5xl bg-white rounded-[32px] border border-gray-100 shadow-[0_12px_45px_rgba(0,0,0,0.07)] p-5 sm:p-7 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center relative">
        {/* Left Side: Dynamic Athlete/Fan Collage in Rounded Card (Desktop/Tablet) */}
        <div className="hidden md:flex relative w-full h-full min-h-[440px] bg-[#111827] rounded-[24px] overflow-hidden items-center justify-center">
          <Image
            src={accountType === "fan" ? fanBanner : athleteBanner}
            alt={
              accountType === "fan"
                ? "PROTIPPZ Fan Community"
                : "PROTIPPZ Athletes"
            }
            priority
            fill
            className="object-cover object-center opacity-85 brightness-90 transition-all duration-500"
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10 pointer-events-none" />

          {/* Switch Account Pill (Desktop) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[350px] p-1 bg-white/95 backdrop-blur-md border border-white/60 shadow-xl rounded-full flex items-center justify-between z-10">
            <button
              type="button"
              onClick={() => setAccountType("fan")}
              className={`flex-1 py-2 px-2.5 text-xs sm:text-[13px] font-semibold rounded-full transition-all duration-300 cursor-pointer text-center ${
                accountType === "fan"
                  ? "bg-[#053697] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-black/5"
              }`}
            >
              Join as a Fan
            </button>
            <button
              type="button"
              onClick={() => setAccountType("athlete")}
              className={`flex-1 py-2 px-2.5 text-xs sm:text-[13px] font-semibold rounded-full transition-all duration-300 cursor-pointer text-center ${
                accountType === "athlete"
                  ? "bg-[#053697] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-black/5"
              }`}
            >
              Join as an Athlete
            </button>
          </div>
        </div>

        {/* Right Side: Clean Sign Up Form */}
        <div className="w-full max-w-sm mx-auto flex flex-col justify-center px-1 sm:px-2 py-2">
          {/* Mobile Account Switcher */}
          <div className="md:hidden mb-4 p-1 bg-gray-100/90 border border-gray-200 rounded-full flex items-center justify-between">
            <button
              type="button"
              onClick={() => setAccountType("fan")}
              className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer text-center ${
                accountType === "fan"
                  ? "bg-[#053697] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Join as a Fan
            </button>
            <button
              type="button"
              onClick={() => setAccountType("athlete")}
              className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer text-center ${
                accountType === "athlete"
                  ? "bg-[#053697] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Join as an Athlete
            </button>
          </div>

          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-black italic tracking-wide text-[#053697] uppercase">
              {accountType === "athlete" ? "ATHLETE SIGN UP" : "FAN SIGN UP"}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {accountType === "athlete"
                ? "Connect with fans, receive Tippz, and grow your career"
                : "Welcome! Support your favorite athletes and win rewards"}
            </p>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={() => login()}
            className="mt-5 w-full h-10 rounded-full bg-[#f1f3f6] hover:bg-[#e6e9ee] transition-colors flex items-center justify-center gap-2.5 text-xs font-semibold text-gray-700 cursor-pointer border border-transparent shadow-sm active:scale-[0.99]"
          >
            <FaGoogle className="text-red-500 text-sm" />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-gray-400 absolute">
              or sign up with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-3">
            {/* Full Name */}
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={
                  accountType === "athlete"
                    ? "Athlete / Sportsperson name"
                    : "Full name"
                }
                className="w-full h-10 pl-9 pr-4 rounded-full border border-gray-200 bg-[#f9fafb] text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#053697] focus:bg-white transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
              />
            </div>

            {/* Email Id */}
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email id"
                className="w-full h-10 pl-9 pr-4 rounded-full border border-gray-200 bg-[#f9fafb] text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#053697] focus:bg-white transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
              />
            </div>

            {/* Password */}
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 characters)"
                className="w-full h-10 pl-9 pr-9 rounded-full border border-gray-200 bg-[#f9fafb] text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#053697] focus:bg-white transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
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

            {/* Terms Checkbox */}
            <div className="flex items-center justify-between text-[11px] text-gray-500 px-1 pt-0.5">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-[#053697] focus:ring-[#053697] accent-[#053697] cursor-pointer"
                />
                <span>
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-[#053697] hover:underline"
                  >
                    Terms
                  </Link>{" "}
                  &{" "}
                  <Link
                    href="/privacy"
                    className="text-[#053697] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={formLoading}
                className="w-full h-10 rounded-full bg-[#053697] hover:bg-[#1e40af] active:bg-[#1e3a8a] disabled:opacity-75 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>
                    {accountType === "athlete"
                      ? "Join as an Athlete"
                      : "Join as a Fan"}
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Bottom Switcher */}
          <p className="text-[11px] text-gray-500 text-center mt-4">
            Already have an account?{" "}
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

const SignUpPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-[#fae8d2]/45 via-[#fcfbf9] to-[#d1fae5]/45">
          <Loader2 className="w-8 h-8 animate-spin text-[#053697]" />
        </div>
      }
    >
      <SignUpFormContent />
    </Suspense>
  );
};

export default SignUpPage;
