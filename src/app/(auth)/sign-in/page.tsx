"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa6";
import { Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useGoogleLogin } from "@react-oauth/google";
import { SignInHandler } from "@/ApisRequests/Auth";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { post } from "@/ApisRequests/server";
import sfemalePlayer from "@/../public/new/female-player.webp";

const SignInPage: React.FC = () => {
  const [userNameOrEmail, setUserNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const getRedirectTarget = (role?: string) => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const redirectUrl = searchParams.get("redirect");
      if (redirectUrl) {
        return redirectUrl;
      }
    }
    return role === "user" ? "/" : "/home";
  };

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
          toast.error("Failed to fetch user info");
          return;
        }

        const userDetails = await response.json();
        const phone =
          userDetails?.phone ||
          userDetails?.phoneNumber ||
          userDetails?.phone_number ||
          "";
        const data = {
          name: userDetails.name || "",
          picture: userDetails.picture || "",
          email: userDetails.email || "",
          username: userDetails.name || "",
          address: userDetails?.address || "",
          phone,
        };

        const res = await post("/auth/google-login", data);
        if (res?.success) {
          Cookies.remove("token");
          localStorage.setItem("token", res?.data?.accessToken);
          Cookies.set("token", res?.data?.accessToken);
          toast.success(res?.message || "Logged in successfully!");
          window.location.href = getRedirectTarget(res?.data?.role);
        } else {
          toast.error(
            res?.message || "Something went wrong. Please try again.",
          );
        }
      } catch (err) {
        console.error("Google sign in error:", err);
        toast.error("Google sign in failed. Please try standard login.");
      }
    },
    onError: () => {
      toast.error("Google sign in was cancelled or failed.");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userNameOrEmail.trim()) {
      toast.error("Please enter your email or username");
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setLoading(true);
    try {
      const res = await SignInHandler({
        userNameOrEmail: userNameOrEmail.trim(),
        password,
      });
      setLoading(false);

      if (res?.success) {
        Cookies.remove("token");
        localStorage.setItem("token", res?.data?.accessToken);
        Cookies.set("token", res?.data?.accessToken);
        toast.success(res?.message || "Logged in successfully!");
        window.location.href = getRedirectTarget(res?.data?.role);
      } else {
        toast.error(res?.message || "Invalid credentials. Please try again.");
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message || "Something went wrong. Please try again.");
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
        {/* Left Side: Athlete Montage Collage in Rounded Card (Desktop/Tablet) */}
        <div className="hidden md:flex relative w-full h-full min-h-[420px] bg-[#e6e8eb] rounded-[24px] overflow-hidden items-center justify-center">
          <Image
            src={sfemalePlayer}
            alt="PROTIPPZ Athletes"
            priority
            fill
            className="object-cover object-center"
          />
        </div>

        {/* Right Side: Clean Sign In Form */}
        <div className="w-full max-w-sm mx-auto flex flex-col justify-center px-1 sm:px-2 py-2">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-black italic tracking-wide text-[#053697] uppercase">
              SIGN IN
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Welcome back! Please sign in to continue
            </p>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={() => login()}
            className="mt-5 w-full h-10 rounded-full bg-[#f1f3f6] hover:bg-[#e6e9ee] transition-colors flex items-center justify-center gap-2.5 text-xs font-semibold text-gray-700 cursor-pointer border border-transparent shadow-sm active:scale-[0.99]"
          >
            <FaGoogle className="text-red-500 text-sm" />
            <span>Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-gray-400 absolute">
              or sign in with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-3.5">
            {/* Email or Username */}
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={userNameOrEmail}
                onChange={(e) => setUserNameOrEmail(e.target.value)}
                placeholder="Email id or username"
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
                placeholder="Password"
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

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-[11px] text-gray-500 px-1 pt-0.5">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-[#053697] focus:ring-[#053697] accent-[#053697] cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <Link
                href="/forget-password"
                className="text-gray-400 hover:text-gray-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 rounded-full bg-[#053697] hover:bg-[#1e40af] active:bg-[#1e3a8a] disabled:opacity-75 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </div>
          </form>

          {/* Bottom Switcher */}
          <p className="text-[11px] text-gray-500 text-center mt-4">
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
  );
};

export default SignInPage;
