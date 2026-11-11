"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const SettingPage: React.FC = () => {
  const [tipAlerts, setTipAlerts] = useState<boolean>(true);
  const [rewardAlerts, setRewardAlerts] = useState<boolean>(true);
  const [emailDigest, setEmailDigest] = useState<boolean>(false);

  return (
    <div className="w-full max-w-355 mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Unified Main Container with Wall-to-Wall Divide X / Y */}
      <div className="w-full bg-white border border-slate-200 rounded-md overflow-hidden divide-y divide-slate-200">

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
        <div className="grid grid-cols-1 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          <div className="col-span-7 flex flex-col justify-between divide-y divide-slate-200 bg-slate-50/40">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
