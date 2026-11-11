"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useContextData } from "@/provider/ContextProvider";
import { imageUrl, post } from "@/ApisRequests/server";
import toast from "react-hot-toast";
import BackButton from "@/components/ui/BackButton";
import EmailVerifyModal from "@/components/UserEmail/EmailVerifyModal";
import UserVerifyOtp from "@/components/UserEmail/UserVerifyOtp";
import defaultPlayer from "@/Assets/playerDefult.jpg";
import {
  Wallet,
  TrendingUp,
  Award,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  ExternalLink,
  Edit3,
  User as UserIcon,
  Mail,
  Calendar,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Clock,
  History,
  FileText,
  Home as HomeIcon,
  CheckCircle2,
  AlertTriangle,
  Instagram,
  Twitter,
  ArrowUpRight,
  Loader2,
  Activity,
} from "lucide-react";
import { FaArrowLeftLong, FaTiktok } from "react-icons/fa6";
import { FinancialSnapshot } from "@/components/player-profile/FinancialSnapshot";
import QuickActionRibbon from "@/components/player-profile/QuickActionRibbon";
import MainBalancedDossier from "@/components/player-profile/MainBalancedDossier";
import {
  StripeConnectModal,
  WithdrawFundsModal,
} from "@/components/player-profile/WithdrawModals";
import { useRouter } from "next/navigation";
import PlayerHeroBanner from "@/components/Playerz/PlayerDetails/PlayerHeroBanner";
import PlayerLastGamesTable from "@/components/Playerz/PlayerLastGamesTable";

const PlayerHomePage = () => {
  const context = useContextData();
  const player = context?.userData;
  const loading = context?.loading;

  // Withdraw & Stripe Connect modals state
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [updatingStripe, setUpdatingStripe] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "games">("info");

  const handleUpdateStripeAccount = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Please sign in to update your Stripe account");
      return;
    }

    setUpdatingStripe(true);
    try {
      const res = await post(
        "/stripe/update-connected-account",
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setUpdatingStripe(false);
      const link = typeof res?.data === "string" ? res.data : res?.data?.link;
      if (res?.success && link) {
        toast.success("Opening Stripe portal to update your profile...");
        window.open(link, "_blank");
        return;
      }

      // Fallback: If update-connected-account didn't return a link, try connect-stripe
      const connectRes = await post(
        "/stripe/connect-stripe",
        { test: "" },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (connectRes?.success && connectRes?.data) {
        toast.success("Opening Stripe portal to complete onboarding...");
        window.open(connectRes.data, "_blank");
      } else {
        toast.error(
          res?.message ||
          connectRes?.message ||
          "Unable to open Stripe update link. Please try again."
        );
      }
    } catch (err: any) {
      setUpdatingStripe(false);
      toast.error(
        err?.message || "Failed to connect to Stripe. Please try again."
      );
    }
  };

  const handleOpenWithdraw = () => {
    if (!player?.isStripeConnected) {
      setShowStripeModal(true);
    } else {
      setShowWithdrawModal(true);
    }
  };

  // Image fallback states
  const [avatarSrc, setAvatarSrc] = useState<string>("");
  const [bgSrc, setBgSrc] = useState<string>("");

  useEffect(() => {
    if (player?.player_image) {
      setAvatarSrc(imageUrl(player?.player_image));
    }
    if (player?.player_bg_image) {
      setBgSrc(imageUrl(player?.player_bg_image));
    }
  }, [player?.player_image, player?.player_bg_image]);

  // Email verification logic
  const userEmail = player?.email || player?.user?.email;
  const isPlayerOrTeam =
    player?.user?.role === "player" || player?.user?.role === "team";
  const verifyEmail = !userEmail && isPlayerOrTeam;

  const [showModal, setShowModal] = useState(false);
  const [showModalOtp, setShowModalOtp] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const router = useRouter()

  useEffect(() => {
    if (verifyEmail) {
      setShowModal(true);
    }
  }, [verifyEmail]);

  // Team name resolution
  const teamName =
    typeof player?.team === "object" && player?.team?.name
      ? player?.team.name
      : typeof player?.team === "string"
        ? player?.team
        : "Independent Athlete";



  if (loading && !player) {
    return (
      <div className="max-w-355 mx-auto px-3.5 lg:px-6 py-6 lg:py-8">
        <div className="animate-pulse space-y-5">
          <div className="h-6 w-24 bg-slate-200 rounded-md" />
          <div className="h-20 bg-white border border-slate-200/90 rounded-[24px] w-full" />
          <div className="h-72 bg-white border border-slate-200/90 rounded-[28px] w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <div className="h-32 bg-white border border-slate-200/90 rounded-[24px]" />
            <div className="h-32 bg-white border border-slate-200/90 rounded-[24px]" />
            <div className="h-32 bg-white border border-slate-200/90 rounded-[24px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-355 mx-auto px-3.5 lg:px-6 py-5 lg:py-8 space-y-5 lg:space-y-6">
      {/* Email Verification Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <EmailVerifyModal
            setAddEmail={setAddEmail}
            showModal={showModal}
            setShowModalOtp={setShowModalOtp}
            setShowModal={setShowModal}
            showModaOtp={showModalOtp}
          />
        </div>
      )}

      {showModalOtp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <UserVerifyOtp
            setShowModalOtp={setShowModalOtp}
            addEmail={addEmail}
          />
        </div>
      )}

      {/* Top Header Card: Apple Toolbar Style with Continuous Squircles */}
      <div className="relative bg-white/95 backdrop-blur-xl border border-slate-200/90 hover:border-slate-300 rounded-[12px] p-2  transition-colors duration-300 flex flex-col lg:flex-row lg:items-center justify-between">
        <button className="flex gap-2 items-center" onClick={() => {
          router.back()
        }}>
          <FaArrowLeftLong />
          Back
        </button>
      </div>

      {/* Payout Setup Alert (if not connected) with Apple-Style Soft Amber Banner */}
      {!player?.isStripeConnected && (
        <div className="relative bg-amber-50/90 backdrop-blur-md border border-amber-200/80 rounded-[22px] lg:rounded-[24px] p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-amber-100/90 text-amber-800 rounded-md shrink-0 border border-amber-200/60">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs lg:text-sm font-bold text-amber-950">
                Payout Method Setup Required
              </h4>
              <p className="text-xs text-amber-800/90 mt-0.5">
                Set up your payout information to enable fast direct deposits when withdrawing your tips.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowStripeModal(true)}
            className="px-4 py-2 bg-[#053697] hover:bg-[#042870] text-white text-xs font-bold rounded-xl whitespace-nowrap self-end lg:self-auto active:scale-[0.98] transition-all cursor-pointer"
          >
            Setup Payouts
          </button>
        </div>
      )}
      {/* Stripe Verification / Update Warning Card (Connected, but isStripeReady is false) */}
      {player?.isStripeConnected && !player?.isStripeReady && (
        <div className="relative bg-gradient-to-r from-amber-50/95 via-amber-50/85 to-orange-50/90 backdrop-blur-xl border border-amber-200/90 rounded-[22px] lg:rounded-[26px] p-4 lg:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 shadow-[0_4px_20px_-4px_rgba(245,158,11,0.08)]">
          <div className="flex items-start gap-2.5">
            <div className="p-2.5 bg-amber-500/15 text-amber-700 rounded-md shrink-0 border border-amber-300/60 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold text-amber-950">
                  Stripe Account Requires Attention
                </h4>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900 text-[10px] font-bold uppercase tracking-wider font-mono">
                  <Clock className="w-3 h-3 text-amber-800" />
                  Action Required
                </span>
              </div>
              <p className="text-xs text-amber-900/85 leading-relaxed max-w-2xl">
                Your Stripe account is connected, but requires additional verification or bank profile details before you can withdraw your funds and receive payouts. Please complete your profile in Stripe to enable direct ACH transfers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch lg:self-end md:self-center shrink-0">
            <button
              type="button"
              onClick={handleUpdateStripeAccount}
              disabled={updatingStripe}
              className="w-full lg:w-auto px-4 py-2.5 bg-[#053697] hover:bg-[#042870] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {updatingStripe ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Connecting to Stripe...</span>
                </>
              ) : (
                <>
                  <span>Update Stripe Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* View Switcher Tabs (Mac/Apple Segmented Control Style) */}
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-[20px] p-1.5 sm:p-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-[14px] text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "info"
                ? "bg-[#053697] text-white shadow-xs"
                : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>User Information</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("games")}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-[14px] text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "games"
                ? "bg-[#053697] text-white shadow-xs"
                : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Player Last Games</span>
          </button>
        </div>

        <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/70 text-slate-500 text-[11px] font-mono font-semibold">
          Athlete Portal
        </span>
      </div>

      {activeTab === "info" ? (
        <>
          {/* Athlete Hero Profile Card with Continuous Squircle Curvature */}
      <div className="relative bg-white/95 backdrop-blur-xl border border-slate-200/90 hover:border-slate-300 rounded-[26px] lg:rounded-[30px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] transition-colors duration-300 overflow-hidden">
        {/* Banner Graphic Background with Subtle Grid Texture */}
        <div
          className="relative h-40 lg:h-52 w-full bg-gradient-to-r from-[#053697] via-[#042874] to-[#021744] overflow-hidden"
        >
          {/* Top-Right Floating Badges */}
          <div className="absolute top-3.5 right-3.5 flex flex-wrap items-center gap-2 z-10">
            {player?.isProfileClaimed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2FC191]/95 backdrop-blur-md text-[#053697] text-xs font-black uppercase tracking-wider rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Athlete</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md text-white border border-white/20 text-xs font-semibold rounded-full">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
                <span>Claim Pending</span>
              </span>
            )}
          </div>
        </div>

        {/* Profile Content Details */}
        <div className="p-4 lg:p-6 lg:p-7">
          <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-2 -mt-16 lg:-mt-22 mb-4">
            {/* Avatar & Identity with Mac Curvature */}
            <div className="flex flex-col lg:flex-row items-center lg:items-end gap-2 text-center lg:text-left w-full lg:w-auto">
              <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-[22px] lg:rounded-[26px] ring-4 ring-white border border-slate-200/90 bg-slate-900 overflow-hidden shrink-0 ">
                <Image
                  src={avatarSrc || defaultPlayer}
                  alt={player?.name || "Player Avatar"}
                  fill
                  sizes="128px"
                  className="object-cover object-top"
                  onError={() => setAvatarSrc(defaultPlayer?.src)}
                  priority
                />
                {player?.jerceyNumber && (
                  <div className="absolute bottom-1.5 right-1.5 bg-[#053697] text-white text-[10px] lg:text-[11px] font-mono font-black px-2 py-0.5 rounded-lg border border-white/30">
                    #{player?.jerceyNumber}
                  </div>
                )}
              </div>

              {/* Player Identity Metadata */}
              <div className="space-y-1 mt-18">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  <h2 className="text-2xl z-999  lg:text-3xl font-black text-slate-900 tracking-tight uppercase">
                    {player?.name}
                  </h2>
                  {player?.username && (
                    <span className="text-xs font-mono text-slate-600 bg-slate-100/90 border border-slate-200/80 px-2.5 py-0.5 rounded-full">
                      @{player?.username}
                    </span>
                  )}
                </div>

                <p className="text-xs lg:text-sm font-bold text-[#053697] flex flex-wrap items-center justify-center lg:justify-start gap-1.5 uppercase tracking-wide">
                  <span>{teamName}</span>
                  {player?.position && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-700">{player?.position}</span>
                    </>
                  )}
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-slate-600 pt-1">
                  {player?.school && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200/70 font-medium">
                      <GraduationCap className="w-3.5 h-3.5 text-[#053697]" />
                      <span>{player?.school}</span>
                    </span>
                  )}
                  {player?.experience && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200/70 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{player?.experience} Exp</span>
                    </span>
                  )}
                  {player?.classYear && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200/70 font-medium">
                      <span>{player?.classYear}</span>
                    </span>
                  )}
                  {(player?.city || player?.state) && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200/70 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{[player?.city, player?.state].filter(Boolean).join(", ")}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action Button with Apple Pill Styling */}
            <div className="w-full lg:w-auto flex justify-center lg:justify-end shrink-0">
              <button
                type="button"
                onClick={handleOpenWithdraw}
                className="w-full lg:w-auto px-5 py-2.5 bg-[#053697] hover:bg-[#042870] text-white font-bold text-xs uppercase tracking-wider rounded-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Wallet className="w-4 h-4 text-[#2FC191]" />
                <span>Withdraw Funds</span>
              </button>
            </div>
          </div>

          {/* Bio Quote - Apple Notes Card Style */}
          {player?.bio && (
            <div className="mt-4 p-4 rounded-md bg-slate-50/90 border border-slate-200/70 text-slate-700 text-xs lg:text-[13px] leading-relaxed">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                <span>NIL Statement</span>
              </div>
              <p className="italic font-medium">
                &ldquo;{player?.bio}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
      <FinancialSnapshot onOpenWithdraw={handleOpenWithdraw} />
      <QuickActionRibbon onOpenWithdraw={handleOpenWithdraw} />

      {/* Main Balanced Dossier Grid: 2 Apple Inspector Columns */}
          <MainBalancedDossier />
        </>
      ) : (
        <PlayerLastGamesTable
          playerId={player?._id}
          teamName={teamName}
          position={player?.position}
          accentColor="#053697"
        />
      )}

      {/* Payout & Withdraw Modals */}
      <StripeConnectModal
        isOpen={showStripeModal}
        onClose={() => setShowStripeModal(false)}
        onSuccess={() => window.location.reload()}
      />

      <WithdrawFundsModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        dueAmount={player?.dueAmount || 0}
        onWithdrawSuccess={() => window.location.reload()}
        isStripeReady={player?.isStripeReady}
      />
    </div>
  );
};

export default PlayerHomePage;
