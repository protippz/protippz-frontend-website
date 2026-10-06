"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Bell,
  Lock,
  User,
  Wallet,
  FileText,
  HelpCircle,
} from "lucide-react";

const SettingPage: React.FC = () => {
  const [tipAlerts, setTipAlerts] = useState<boolean>(true);
  const [rewardAlerts, setRewardAlerts] = useState<boolean>(true);
  const [emailDigest, setEmailDigest] = useState<boolean>(false);

  return (
    <div className="w-full max-w-355 mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Unified Main Container with Wall-to-Wall Divide X / Y */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200">
        
        {/* Header Bar */}
        <div className="px-6 sm:px-8 py-6 bg-white">
          <span className="text-xs font-bold text-[#053697] uppercase tracking-wider">
            Account Preferences
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
            Settings
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage your password, security options, and notification preferences
          </p>
        </div>

        {/* Content Section: Connected Divide Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          
          {/* LEFT COLUMN: Security & Notifications (7 of 12 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between divide-y divide-slate-200 bg-white">
            
            {/* Section 1: Password & Security */}
            <div className="divide-y divide-slate-100">
              <div className="px-6 sm:px-8 py-4 bg-slate-50/50 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Password & Security
                </h2>
                <span className="text-[11px] font-semibold text-[#2FC191] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Protected
                </span>
              </div>

              {/* Change Password Link Row */}
              <Link
                href="/change-password"
                className="group px-6 sm:px-8 py-4.5 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight group-hover:text-[#053697] transition-colors">
                    Change Password
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Update your password to keep your account protected
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#053697] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            </div>

            {/* Section 2: Notification Settings */}
            <div className="divide-y divide-slate-100">
              <div className="px-6 sm:px-8 py-4 bg-slate-50/50">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Notification Preferences
                </h2>
              </div>

              {/* Toggle 1: Tipping Activity */}
              <div className="px-6 sm:px-8 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                    Tipping Activity Alerts
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Receive instant notifications whenever you send a tip
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={tipAlerts}
                  onClick={() => setTipAlerts(!tipAlerts)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    tipAlerts ? "bg-[#2FC191]" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      tipAlerts ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: Reward Earnings */}
              <div className="px-6 sm:px-8 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                    Rewards & Points Alerts
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Get notified when you earn reward points and redeem prizes
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={rewardAlerts}
                  onClick={() => setRewardAlerts(!rewardAlerts)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    rewardAlerts ? "bg-[#2FC191]" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      rewardAlerts ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3: Email & SMS Digest */}
              <div className="px-6 sm:px-8 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                    Email & SMS Digests
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Periodic summaries of your account activity and announcements
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={emailDigest}
                  onClick={() => setEmailDigest(!emailDigest)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    emailDigest ? "bg-[#2FC191]" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      emailDigest ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Bottom Security Assurance */}
            <div className="px-6 sm:px-8 py-4 bg-slate-50/50 flex items-center justify-between text-[11px] text-slate-500">
              <span>Security Protocol: 256-bit SSL</span>
              <span className="font-semibold text-slate-700">PCI-DSS Compliant</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Quick Navigation & Help (5 of 12 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between divide-y divide-slate-200 bg-slate-50/40">
            {/* Header */}
            <div className="px-6 py-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Account Shortcuts
              </h3>
            </div>

            {/* Navigation Links */}
            <div className="divide-y divide-slate-100 bg-white">
              {/* Edit Profile */}
              <Link
                href="/profile"
                className="group px-6 py-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-[#053697] transition-colors">
                    Personal Profile
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    View and update your display information
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#053697] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>

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
                    Add money to your wallet balance
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
                    Review ledger history and receipts
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#053697] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>

              {/* FAQs & Support */}
              <Link
                href="/faqs"
                className="group px-6 py-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-[#053697] transition-colors">
                    Help & FAQs
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Common questions and customer support
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#053697] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            </div>

            {/* Info Footer */}
            <div className="p-6 bg-slate-50/50 text-[11px] text-slate-500 leading-relaxed">
              Need assistance with your account or privacy preferences? Visit our Help Center or contact support anytime.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingPage;
