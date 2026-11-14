"use client";

import React from "react";
import Link from "next/link";
import {
  Trophy,
  Shield,
  Edit3,
  User as UserIcon,
  Users,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa6";

interface TeamBalancedDossierProps {
  team: any;
  rosterCount?: number;
  onEditProfile?: () => void;
}

export default function TeamBalancedDossier({
  team,
  rosterCount = 0,
  onEditProfile,
}: TeamBalancedDossierProps) {
  // Address formatting
  const formattedAddress = team?.address?.streetAddress
    ? `${team?.address.streetAddress}, ${
        team?.address.city || team?.city || ""
      }, ${team?.address.state || team?.state || ""} ${
        team?.address.zipCode || ""
      }`.trim()
    : [team?.city, team?.state, team?.country].filter(Boolean).join(", ") ||
      "No address on file";

  const leagueName =
    typeof team?.league === "object" && team?.league?.name
      ? team?.league.name
      : typeof team?.league === "string"
      ? team?.league
      : "Independent Franchise";

  const formattedClaimedDate = team?.claimedAt
    ? new Date(team.claimedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : team?.createdAt
    ? new Date(team.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-4 items-start">
      {/* Card 1: Franchise & Athletic Dossier */}
      <div className="bg-white/95 backdrop-blur-xl rounded-[24px] sm:rounded-[26px] border border-slate-200/90 hover:border-slate-300 transition-colors duration-300 overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#053697]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Franchise & League Dossier
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 rounded-full font-mono">
              Franchise
            </span>
            {onEditProfile && (
              <button
                type="button"
                onClick={onEditProfile}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#053697]/10 hover:bg-[#053697]/20 text-[#053697] rounded-full text-[10px] font-bold transition-all active:scale-[0.98] cursor-pointer"
                title="Edit Team Info"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>

        <div className="divide-y divide-slate-100 text-xs sm:text-sm">
          <div className="px-5 py-3.5 flex items-center justify-between gap-2 bg-white/50">
            <span className="font-medium text-slate-400">Official League</span>
            <span className="font-bold text-slate-900 text-right truncate">
              {leagueName}
            </span>
          </div>

          <div className="px-5 py-3.5 flex items-center justify-between gap-2 bg-white/50">
            <span className="font-medium text-slate-400">Sport Category</span>
            <span className="font-bold text-slate-900 text-right uppercase">
              {team?.sport || "Athletics"}
            </span>
          </div>

          <div className="px-5 py-3.5 flex items-center justify-between gap-2 bg-white/50">
            <span className="font-medium text-slate-400">Active Roster</span>
            <span className="font-mono font-bold text-[#053697] text-right">
              {rosterCount} Athletes registered
            </span>
          </div>

          <div className="px-5 py-3.5 flex items-center justify-between gap-2 bg-white/50">
            <span className="font-medium text-slate-400">Supporters</span>
            <span className="font-bold text-slate-900 text-right">
              {team?.followersCount || 0} Followers
            </span>
          </div>

          <div className="px-5 py-3.5 flex items-center justify-between gap-2 bg-white/50">
            <span className="font-medium text-slate-400">Verification</span>
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 text-right">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2FC191]" />
              <span>{team?.isProfileClaimed ? "Claimed & Verified" : "Claim Pending"}</span>
            </span>
          </div>

          {formattedClaimedDate && (
            <div className="px-5 py-3.5 flex items-center justify-between gap-2 bg-white/50">
              <span className="font-medium text-slate-400">Member Since</span>
              <span className="font-bold text-slate-700 text-right font-mono text-xs">
                {formattedClaimedDate}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card 2: Account & Identity Dossier */}
      <div className="bg-white/95 backdrop-blur-xl rounded-[24px] sm:rounded-[26px] border border-slate-200/90 hover:border-slate-300 transition-colors duration-300 overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-[#2FC191]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Account & Identity
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 rounded-full font-mono">
              Team Portal
            </span>
            {onEditProfile && (
              <button
                type="button"
                onClick={onEditProfile}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#053697]/10 hover:bg-[#053697]/20 text-[#053697] rounded-full text-[10px] font-bold transition-all active:scale-[0.98] cursor-pointer"
                title="Edit Account Details"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>

        <div className="divide-y divide-slate-100 text-xs sm:text-sm">
          <div className="px-5 py-3.5 flex items-center justify-between gap-2 bg-white/50">
            <span className="font-medium text-slate-400">Team Name</span>
            <span className="font-bold text-slate-900 text-right truncate">
              {team?.name || "N/A"}
            </span>
          </div>

          <div className="px-5 py-3.5 flex items-center justify-between gap-2 bg-white/50">
            <span className="font-medium text-slate-400">Portal Handle</span>
            <span className="font-mono text-slate-700 text-right">
              {team?.username ? `@${team?.username}` : "N/A"}
            </span>
          </div>

          <div className="px-5 py-3.5 flex items-center justify-between gap-2 bg-white/50">
            <span className="font-medium text-slate-400">Contact Email</span>
            <span className="font-semibold text-[#053697] text-right break-all">
              {team?.email || team?.user?.email || "N/A"}
            </span>
          </div>

          <div className="px-5 py-3.5 flex items-center justify-between gap-2 bg-white/50">
            <span className="font-medium text-slate-400 shrink-0">
              Payout Address
            </span>
            <div className="flex items-center gap-2 justify-end">
              <span className="text-slate-800 font-medium text-right break-words text-xs sm:text-sm">
                {formattedAddress}
              </span>
              <Link
                href="/address"
                className="p-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/70 text-[#053697] rounded-xl shrink-0 transition-colors"
                title="Edit Address"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Social Handles Sub-section in Clean Apple Pill Dock Style */}
          <div className="px-5 py-3.5 bg-white/50">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Social Channels
            </span>
            <div className="grid grid-cols-3 gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100/90 border border-slate-200/80 text-slate-700 text-xs rounded-xl truncate">
                <FaInstagram className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span className="font-mono truncate">
                  {team?.instagram ? `@${team?.instagram}` : "No IG"}
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100/90 border border-slate-200/80 text-slate-700 text-xs rounded-xl truncate">
                <FaTwitter className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                <span className="font-mono truncate">
                  {team?.twitter ? `@${team?.twitter}` : "No X"}
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100/90 border border-slate-200/80 text-slate-700 text-xs rounded-xl truncate">
                <FaTiktok className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                <span className="font-mono truncate">
                  {team?.tiktok ? `@${team?.tiktok}` : "No TikTok"}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

