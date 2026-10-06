"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/ApisRequests/server";
import { useContextData } from "@/provider/ContextProvider";
import { Edit3, BadgeCheck, ArrowRight } from "lucide-react";

const ProfilePage = () => {
  const data = useContextData();
  const user = data?.userData;

  const profileImgSrc =
    imageUrl(user?.profile_image || "") ||
    "https://i.ibb.co.com/f4tzYw2/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg";

  const formattedAddress =
    typeof user?.address === "string"
      ? user?.address
      : user?.address?.streetAddress
      ? `${user.address.streetAddress}${
          user.address.city ? `, ${user.address.city}` : ""
        }${user.address.state ? `, ${user.address.state}` : ""}`
      : null;

  return (
    <div className="w-full max-w-355 mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Unified Professional Container */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200">
        
        {/* TOP SECTION: Professional Header Banner & Identity */}
        <div>
          {/* Subtle Tone Header */}
          <div className="h-28 sm:h-32 bg-gradient-to-r from-[#0d2e73] via-[#123F9C] to-[#1D4ED8]" />

          {/* Profile Identity Row */}
          <div className="px-6 sm:px-8 pb-6 pt-0">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
              {/* Avatar (clean 96px, 50% boundary overlap) */}
              <div className="relative w-24 h-24 sm:w-26 sm:h-26 rounded-full border-4 border-white bg-slate-100 overflow-hidden shrink-0">
                <Image
                  src={profileImgSrc}
                  alt={user?.name || "User Avatar"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 96px, 104px"
                />
              </div>

              {/* Action Button */}
              <div className="flex items-center">
                <Link
                  href={`/profile/${user?._id || ""}`}
                  className="inline-flex items-center gap-2 bg-[#053697] hover:bg-[#053697]/90 text-white text-xs sm:text-sm font-semibold px-4.5 py-2 rounded-xl transition-colors shrink-0"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </Link>
              </div>
            </div>

            {/* Name & Handle */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {user?.name || "Guest User"}
                </h1>
                <BadgeCheck className="w-5 h-5 text-[#2FC191] shrink-0" />
              </div>
              <p className="text-sm font-medium text-slate-500 mt-0.5">
                @{user?.username || "username"}
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Connected Divide-X / Divide-Y Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          
          {/* LEFT COLUMN: Personal Information & Account Overview (7 of 12 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between divide-y divide-slate-200">
            <div>
              {/* Column Header */}
              <div className="px-6 py-4 bg-white flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Personal Information
                </h2>
                <span className="text-[11px] font-semibold text-[#2FC191]">
                  Verified Account
                </span>
              </div>

              {/* Information Rows */}
              <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                {/* Full Name */}
                <div className="px-6 py-4 flex items-center justify-between gap-4">
                  <span className="font-medium text-slate-500">Full Name</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {user?.name || "Not provided"}
                  </span>
                </div>

                {/* Username */}
                <div className="px-6 py-4 flex items-center justify-between gap-4">
                  <span className="font-medium text-slate-500">Username</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {user?.username ? `@${user.username}` : "Not set"}
                  </span>
                </div>

                {/* Email Address */}
                <div className="px-6 py-4 flex items-center justify-between gap-4">
                  <span className="font-medium text-slate-500">Email Address</span>
                  <span className="font-semibold text-slate-900 text-right truncate max-w-[200px] sm:max-w-xs">
                    {user?.email || "Not provided"}
                  </span>
                </div>

                {/* Phone Number */}
                <div className="px-6 py-4 flex items-center justify-between gap-4">
                  <span className="font-medium text-slate-500">Phone Number</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {user?.phone || "Not provided"}
                  </span>
                </div>

                {/* Location */}
                <div className="px-6 py-4 flex items-center justify-between gap-4">
                  <span className="font-medium text-slate-500">Location</span>
                  <span className="font-semibold text-slate-900 text-right truncate max-w-[200px] sm:max-w-xs">
                    {formattedAddress || "Not provided"}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Activity Summary (Clean Minimalist Numbers) */}
            <div className="grid grid-cols-2 divide-x divide-slate-200 bg-slate-50/50">
              <div className="px-6 py-4">
                <span className="text-xs text-slate-500 font-medium">Reward Points</span>
                <p className="text-xl font-bold text-slate-900 mt-0.5">
                  {user?.totalPoint || 0}{" "}
                  <span className="text-xs font-semibold text-slate-400">PTS</span>
                </p>
              </div>

              <div className="px-6 py-4">
                <span className="text-xs text-slate-500 font-medium">Lifetime Tips</span>
                <p className="text-xl font-bold text-slate-900 mt-0.5">
                  {user?.totalTips || 0}
                </p>
              </div>
            </div>

            {/* Professional Security Note */}
            <div className="px-6 py-3.5 bg-white flex items-center justify-between text-[11px] text-slate-500">
              <span>Security Status: 256-bit SSL Encrypted</span>
              <span className="font-semibold text-slate-700">PCI-DSS Protected</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Quick Shortcuts (5 of 12 cols) */}
          <div className="lg:col-span-5 flex flex-col divide-y divide-slate-200 bg-slate-50/40">
            {/* Header */}
            <div className="px-6 py-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Quick Shortcuts
              </h3>
            </div>

            {/* Clean Professional Shortcut Rows */}
            <div className="divide-y divide-slate-100 bg-white">
              {/* Deposit Funds */}
              <Link
                href="/deposit"
                className="group px-6 py-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-[#053697] transition-colors">
                    Deposit Funds
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Add money to your wallet
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#053697] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>

              {/* Withdraw Funds */}
              <Link
                href="/withdraw"
                className="group px-6 py-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-[#053697] transition-colors">
                    Withdraw Funds
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Cash out your available balance
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#053697] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>

              {/* Tippz History */}
              <Link
                href="/tippz-history"
                className="group px-6 py-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-[#053697] transition-colors">
                    Tippz History
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    View sent tips & points earned
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#053697] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>

              {/* Transaction Log */}
              <Link
                href="/transaction-log"
                className="group px-6 py-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-[#053697] transition-colors">
                    Transaction Log
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Ledger entries & payment history
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#053697] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>

              {/* Favorite Players */}
              <Link
                href="/favorites"
                className="group px-6 py-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-[#053697] transition-colors">
                    Favorite Players
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Athletes and teams you follow
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#053697] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>

              {/* Invite Friends */}
              <Link
                href="/invite-friends"
                className="group px-6 py-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-[#053697] transition-colors">
                    Invite Friends
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Refer friends & earn bonus rewards
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#053697] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>

              {/* Settings */}
              <Link
                href="/settings"
                className="group px-6 py-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-[#053697] transition-colors">
                    Account Settings
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Preferences, passwords & security
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#053697] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
