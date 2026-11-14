"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContextData } from "@/provider/ContextProvider";
import { get, imageUrl, post } from "@/ApisRequests/server";
import toast from "react-hot-toast";
import {
  Wallet,
  Trophy,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  ExternalLink,
  Edit3,
  User as UserIcon,
  Users,
  Clock,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FinancialSnapshot } from "@/components/player-profile/FinancialSnapshot";
import QuickActionRibbon from "@/components/player-profile/QuickActionRibbon";
import {
  StripeConnectModal,
  WithdrawFundsModal,
} from "@/components/player-profile/WithdrawModals";
import { TeamUpdateProfileModal } from "@/components/team-profile/TeamUpdateProfileModal";
import TeamBalancedDossier from "@/components/team-profile/TeamBalancedDossier";
import TeamRosterSection from "@/components/Teamz/TeamDetails/TeamRosterSection";
import EmailVerifyModal from "@/components/UserEmail/EmailVerifyModal";
import UserVerifyOtp from "@/components/UserEmail/UserVerifyOtp";
import { Player } from "@/app/(default)/playerz/page";
import ptLogo from "@/Assets/PT Logo.png";

const TeamHomePage = () => {
  const router = useRouter();
  const context = useContextData();
  const team = context?.userData;
  const loading = context?.loading;

  // View Switcher Tabs: "info" | "roster"
  const [activeTab, setActiveTab] = useState<"info" | "roster">("info");

  // Modals state
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [updatingStripe, setUpdatingStripe] = useState(false);

  // Roster state
  const [roster, setRoster] = useState<Player[]>([]);
  const [loadingRoster, setLoadingRoster] = useState<boolean>(false);

  // Logo fallback state
  const [logoSrc, setLogoSrc] = useState<string>("");

  useEffect(() => {
    if (team?.team_logo) {
      setLogoSrc(imageUrl(team.team_logo));
    }
  }, [team?.team_logo]);

  // Fetch Team Roster
  useEffect(() => {
    if (!team?._id) return;
    let isMounted = true;

    const fetchRoster = async () => {
      setLoadingRoster(true);
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await get(`/player/get-all?team=${team._id}&limit=100`, {
          headers: token ? { Authorization: `${token}` } : {},
        });
        if (isMounted && res?.data?.result) {
          setRoster(res.data.result);
        }
      } catch (err) {
        console.error("Failed to fetch team roster:", err);
      } finally {
        if (isMounted) setLoadingRoster(false);
      }
    };

    fetchRoster();

    return () => {
      isMounted = false;
    };
  }, [team?._id]);

  // Handle Stripe Account Portal / Onboarding
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

      // Fallback: connect-stripe
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
    if (!team?.isStripeConnected) {
      setShowStripeModal(true);
    } else {
      setShowWithdrawModal(true);
    }
  };

  // Email verification logic
  const userEmail = team?.email || team?.user?.email;
  const isPlayerOrTeam =
    team?.user?.role === "player" || team?.user?.role === "team";
  const verifyEmail = !userEmail && isPlayerOrTeam;

  const [showModal, setShowModal] = useState(false);
  const [showModalOtp, setShowModalOtp] = useState(false);
  const [addEmail, setAddEmail] = useState("");

  useEffect(() => {
    if (verifyEmail) {
      setShowModal(true);
    }
  }, [verifyEmail]);

  // Resolve League Name
  const leagueName =
    typeof team?.league === "object" && team?.league?.name
      ? team.league.name
      : typeof team?.league === "string"
      ? team.league
      : "Official League";

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return (
    <div className="max-w-355 mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Email Verification Prompt Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <EmailVerifyModal
            setAddEmail={setAddEmail}
            showModal={showModal}
            setShowModalOtp={setShowModalOtp}
            setShowModal={setShowModal}
            showModaOtp={showModalOtp}
          />
        </div>
      )}

      {/* OTP Verification Modal */}
      {showModalOtp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <UserVerifyOtp
            setShowModalOtp={setShowModalOtp}
            addEmail={addEmail}
          />
        </div>
      )}

      {/* Top Header Card: Apple Toolbar Style with Continuous Squircles */}
      <div className="relative bg-white/95 backdrop-blur-xl border border-slate-200/90 hover:border-slate-300 rounded-[12px] p-2 transition-colors duration-300 flex flex-col lg:flex-row lg:items-center justify-between">
        <button
          className="flex gap-2 items-center text-slate-700 hover:text-slate-900 font-bold text-xs sm:text-sm cursor-pointer transition-colors"
          onClick={() => router.back()}
        >
          <FaArrowLeftLong />
          Back
        </button>
      </div>

      {/* Payout Setup Alert (if not connected) */}
      {!team?.isStripeConnected && (
        <div className="relative bg-amber-50/90 backdrop-blur-md border border-amber-200/80 rounded-[22px] lg:rounded-[24px] p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-amber-100/90 text-amber-800 rounded-md shrink-0 border border-amber-200/60">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs lg:text-sm font-bold text-amber-950">
                Team Payout Method Setup Required
              </h4>
              <p className="text-xs text-amber-800/90 mt-0.5">
                Set up direct deposits via Stripe Connect to withdraw your organization&apos;s digital tips.
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
      {team?.isStripeConnected && !team?.isStripeReady && (
        <div className="relative bg-gradient-to-r from-amber-50/95 via-amber-50/85 to-orange-50/90 backdrop-blur-xl border border-amber-200/90 rounded-[22px] lg:rounded-[26px] p-4 lg:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
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
                Your team Stripe account is connected, but requires additional verification or banking details before payouts can be disbursed. Please complete your profile in Stripe.
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

      {/* Team Hero Profile Card with Continuous Squircle Curvature */}
      <div className="relative bg-white/95 backdrop-blur-xl border border-slate-200/90 hover:border-slate-300 rounded-[26px] lg:rounded-[30px] transition-colors duration-300 overflow-hidden">
        {/* Banner Graphic Background with Subtle Grid Texture */}
        <div className="relative h-40 lg:h-52 w-full bg-gradient-to-r from-[#053697] via-[#042874] to-[#021744] overflow-hidden">
          {team?.team_bg_image && (
            <Image
              src={imageUrl(team.team_bg_image)}
              alt="Team Cover"
              fill
              className="object-cover opacity-35"
            />
          )}

          {/* Top-Right Floating Badges */}
          <div className="absolute top-3.5 right-3.5 flex flex-wrap items-center gap-2 z-10">
            {team?.isProfileClaimed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2FC191]/95 backdrop-blur-md text-[#053697] text-xs font-black uppercase tracking-wider rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Franchise</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md text-white border border-white/20 text-xs font-semibold rounded-full">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
                <span>Claim Pending</span>
              </span>
            )}

            {team?.sport && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/25 text-xs font-bold uppercase tracking-wider rounded-full">
                <span>{team.sport}</span>
              </span>
            )}

            {leagueName && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/25 text-xs font-bold uppercase tracking-wider rounded-full font-mono">
                <span>{leagueName}</span>
              </span>
            )}
          </div>
        </div>

        {/* Profile Content Details */}
        <div className="p-4 lg:p-6 lg:p-7">
          <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-2 -mt-16 lg:-mt-22 mb-4">
            {/* Logo & Identity with Mac Curvature */}
            <div className="flex flex-col lg:flex-row items-center lg:items-end gap-3 text-center lg:text-left w-full lg:w-auto">
              <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-[22px] lg:rounded-[26px] ring-4 ring-white border border-slate-200/90 bg-slate-900 overflow-hidden shrink-0 group flex items-center justify-center">
                <Image
                  src={logoSrc || ptLogo.src}
                  alt={team?.name || "Team Logo"}
                  fill
                  sizes="128px"
                  className="object-contain p-2"
                  onError={() => setLogoSrc(ptLogo.src)}
                  priority
                />

                {/* Logo Quick Edit Overlay */}
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(true)}
                  className="absolute inset-0 bg-black/45 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200 cursor-pointer"
                  title="Update Team Logo"
                >
                  <Edit3 className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold tracking-wider uppercase">
                    Edit Logo
                  </span>
                </button>
              </div>

              {/* Team Identity Metadata */}
              <div className="space-y-1 mt-4 lg:mt-0">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight uppercase">
                    {team?.name || "Team Profile"}
                  </h2>
                  {team?.username && (
                    <span className="text-xs font-mono text-slate-600 bg-slate-100/90 border border-slate-200/80 px-2.5 py-0.5 rounded-full">
                      @{team.username}
                    </span>
                  )}
                </div>

                <p className="text-xs lg:text-sm font-bold text-[#053697] flex flex-wrap items-center justify-center lg:justify-start gap-1.5 uppercase tracking-wide">
                  <span>{leagueName}</span>
                  {team?.sport && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-700">{team.sport}</span>
                    </>
                  )}
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-slate-600 pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200/70 font-medium">
                    <Users className="w-3.5 h-3.5 text-[#053697]" />
                    <span>{roster.length} Roster Athletes</span>
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200/70 font-medium">
                    <span>{team?.followersCount || 0} Followers</span>
                  </span>

                  {(team?.city || team?.state) && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200/70 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>
                        {[team?.city, team?.state].filter(Boolean).join(", ")}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action Buttons with Apple Pill Styling */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-2.5 shrink-0 mt-4 lg:mt-0">
              <button
                type="button"
                onClick={() => setShowEditProfileModal(true)}
                className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-[#053697]" />
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                onClick={handleOpenWithdraw}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#053697] hover:bg-[#042870] text-white font-bold text-xs uppercase tracking-wider rounded-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Wallet className="w-4 h-4 text-[#2FC191]" />
                <span>Withdraw Funds</span>
              </button>
            </div>
          </div>

          {/* Description Quote - Apple Notes Card Style */}
          {team?.description && (
            <div className="mt-4 p-4 rounded-md bg-slate-50/90 border border-slate-200/70 text-slate-700 text-xs lg:text-[13px] leading-relaxed">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                <span>Franchise Statement</span>
              </div>
              <p className="italic font-medium">&ldquo;{team.description}&rdquo;</p>
            </div>
          )}
        </div>
      </div>

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
            <span>Team Information</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("roster")}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-[14px] text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "roster"
                ? "bg-[#053697] text-white shadow-xs"
                : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Official Roster</span>
            <span
              className={`px-2 py-0.5 text-[10px] rounded-full font-mono ${
                activeTab === "roster"
                  ? "bg-white/20 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {roster.length}
            </span>
          </button>
        </div>

        <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/70 text-slate-500 text-[11px] font-mono font-semibold">
          Franchise Portal
        </span>
      </div>

      {activeTab === "info" ? (
        <>
          {/* Financial Metrics */}
          <FinancialSnapshot onOpenWithdraw={handleOpenWithdraw} />

          {/* Quick Action Buttons */}
          <QuickActionRibbon onOpenWithdraw={handleOpenWithdraw} />

          {/* Team Balanced Dossier Grid: 2 Apple Inspector Columns */}
          <TeamBalancedDossier
            team={team}
            rosterCount={roster.length}
            onEditProfile={() => setShowEditProfileModal(true)}
          />
        </>
      ) : (
        /* Team Roster Tab */
        <div className="space-y-4">
          {loadingRoster ? (
            <div className="py-16 text-center text-slate-400 flex items-center justify-center gap-2 bg-white rounded-3xl border border-slate-200/90">
              <Loader2 className="w-5 h-5 animate-spin text-[#053697]" />
              <span className="text-sm font-semibold">Loading official roster...</span>
            </div>
          ) : (
            <TeamRosterSection
              roster={roster}
              teamName={team?.name || "Team"}
              token={token}
              accentColor="#053697"
            />
          )}
        </div>
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
        dueAmount={team?.dueAmount || 0}
        onWithdrawSuccess={() => window.location.reload()}
        isStripeReady={team?.isStripeReady}
      />

      {/* Team Update Profile Modal */}
      <TeamUpdateProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        team={team}
        onSuccess={() => {
          if (context?.hardLoad) {
            context.hardLoad();
          } else {
            window.location.reload();
          }
        }}
        onEmailChange={(newEmail) => {
          setAddEmail(newEmail);
          setShowModalOtp(true);
        }}
      />
    </div>
  );
};

export default TeamHomePage;
