"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { post } from "@/ApisRequests/server";
import toast from "react-hot-toast";
import GoToTop from "@/components/ui/GoToTop";
import { useContextData } from "@/provider/ContextProvider";
import {
  Users,
  Gift,
  Share2,
  Copy,
  Check,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Trophy,
  CheckCircle2,
  Loader2,
  X,
  HelpCircle,
  Award,
} from "lucide-react";
import {
  FaWhatsapp,
  FaTwitter,
  FaFacebookF,
  FaTelegramPlane,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const InviteFriendsPage: React.FC = () => {
  const router = useRouter();
  const contextData = useContextData();
  const user = contextData?.userData;
  const totalPoints = user?.totalPoint || 0;

  const [inviteLink, setInviteLink] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenModal(false);
    };
    if (openModal) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openModal]);

  const inviteHandler = async () => {
    const token =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("token")
        : null;

    if (!token) {
      toast.error("Please log in to generate your referral link");
      router.push("/sign-in");
      return;
    }

    setLoading(true);
    try {
      const res = await post(
        "/invite/invite-friend",
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (res?.success && res?.data?.link) {
        setInviteLink(res.data.link);
        setOpenModal(true);
      } else {
        toast.error(res?.message || "Failed to generate referral link");
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!inviteLink) return;
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        setCopied(true);
        toast.success("Invite link copied to clipboard!");
        setTimeout(() => setCopied(false), 2500);
      })
      .catch(() => {
        toast.error("Failed to copy referral link");
      });
  };

  const shareText = "Join me on PROTIPPZ! Tip college athletes, earn reward points, and win exclusive fan perks:";

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#fcfbf9] via-white to-[#f5f8fa] py-8 sm:py-12 pb-20">
      <GoToTop />

      <div className="max-w-355 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5 font-mono text-xs font-bold text-[#053697]">
              <span className="w-2 h-2 rounded-full bg-[#2FC191]" />
              <span>[REFERRAL VAULT: INVITE & EARN]</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Invite Friends
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl">
              Share the thrill of collegiate sports tipping. For every friend who registers with your link, you&apos;ll earn 10 reward points.
            </p>
          </div>

          <Link
            href="/rewardz"
            className="inline-flex items-center gap-2 self-start sm:self-auto text-xs font-bold text-[#053697] bg-blue-50/80 hover:bg-blue-100/80 px-4 py-2.5 rounded-xl border border-blue-100 transition-colors shadow-2xs"
          >
            <Trophy className="w-4 h-4 text-[#2FC191]" />
            <span>Visit Rewardz Store</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
          </Link>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-8 items-stretch">
          {/* Big Primary Card (Left Side) */}
          <div className="md:col-span-6 lg:col-span-7 bg-[#053697] text-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden border border-[#053697] shadow-xs min-h-[160px]">
            <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute right-10 top-2 w-32 h-32 rounded-full bg-[#2FC191]/15 blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-blue-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2FC191]" />
                Referral Reward Bonus
              </span>
              <div className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white flex items-baseline gap-2">
                <span>+10</span>
                <span className="text-base sm:text-lg font-bold text-[#2FC191] uppercase">
                  Points / Friend
                </span>
              </div>
            </div>

            <div className="relative z-10 mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs text-blue-100">
              <span>Automatic point credit upon friend registration</span>
              <span className="font-semibold text-[#2FC191] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2FC191] animate-pulse" />
                Live Program
              </span>
            </div>
          </div>

          {/* Right Stacked Metric Cards */}
          <div className="md:col-span-6 lg:col-span-5 grid grid-cols-2 gap-3">
            {/* User Points Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Your Balance
                </span>
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Award className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="my-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {totalPoints.toLocaleString()}{" "}
                <span className="text-xs font-bold text-slate-400 uppercase">
                  pts
                </span>
              </div>
              <Link
                href="/rewardz"
                className="text-[11px] text-[#053697] font-bold hover:underline flex items-center gap-1"
              >
                <span>Redeem in Store</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Referrals Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Invitations
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="my-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Unlimited
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                No cap on bonus earnings
              </p>
            </div>
          </div>
        </div>

        {/* ─── MAIN LINK GENERATOR & SHARE CARD ─── */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden mb-10">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#053697] flex items-center gap-1.5 mb-1.5">
              <Share2 className="w-3.5 h-3.5 text-[#2FC191]" />
              Start Sharing
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Share Your Personal Invite Link
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              Generate your unique referral URL and share it across your network, chat groups, and social channels.
            </p>

            {/* Link Box or Generate Action */}
            <div className="mt-6">
              {inviteLink ? (
                <div className="space-y-4">
                  {/* Copyable Input Row */}
                  <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        readOnly
                        value={inviteLink}
                        className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs sm:text-sm font-mono font-medium outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleCopy}
                      className="h-12 px-6 rounded-xl bg-[#053697] hover:bg-[#042873] active:scale-[0.99] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-[#2FC191]" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Quick Share Buttons */}
                  <div className="pt-2">
                    <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2.5">
                      Or Share Directly Via:
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* WhatsApp */}
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                          `${shareText} ${inviteLink}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] font-bold text-xs transition-colors"
                      >
                        <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
                        <span>WhatsApp</span>
                      </a>

                      {/* X / Twitter */}
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                          shareText
                        )}&url=${encodeURIComponent(inviteLink)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs transition-colors"
                      >
                        <FaTwitter className="w-3.5 h-3.5 text-slate-700" />
                        <span>X (Twitter)</span>
                      </a>

                      {/* Email */}
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(
                          "Join me on PROTIPPZ!"
                        )}&body=${encodeURIComponent(
                          `Hey,\n\nJoin me on PROTIPPZ to support collegiate athletes and earn rewards!\n\nUse my invite link: ${inviteLink}\n\nCheers!`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100/80 border border-rose-200/60 text-rose-700 font-bold text-xs transition-colors"
                      >
                        <MdEmail className="w-4 h-4 text-rose-600" />
                        <span>Gmail</span>
                      </a>

                      {/* Facebook */}
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          inviteLink
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200/60 text-[#053697] font-bold text-xs transition-colors"
                      >
                        <FaFacebookF className="w-3.5 h-3.5 text-[#053697]" />
                        <span>Facebook</span>
                      </a>

                      {/* Telegram */}
                      <a
                        href={`https://t.me/share/url?url=${encodeURIComponent(
                          inviteLink
                        )}&text=${encodeURIComponent(shareText)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100/80 border border-sky-200/60 text-sky-700 font-bold text-xs transition-colors"
                      >
                        <FaTelegramPlane className="w-3.5 h-3.5 text-sky-500" />
                        <span>Telegram</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={inviteHandler}
                  disabled={loading}
                  className="h-12 px-8 rounded-xl bg-[#053697] hover:bg-[#042873] active:scale-[0.99] disabled:opacity-60 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Generating Link...</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-[#2FC191]" />
                      <span>Generate My Referral Link</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── HOW IT WORKS 3-STEP GRID ─── */}
        <div className="mb-10">
          <div className="text-center sm:text-left mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#053697]">
              Simple 3-Step Process
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              How the Referral Program Works
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1 */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs space-y-3.5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#053697] flex items-center justify-center font-black text-base border border-blue-100 shadow-2xs">
                  01
                </div>
                <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">
                  1. Share Your Link
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Generate your unique invitation URL and share it via WhatsApp, SMS, email, or social media with fellow fans.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-[#053697]">
                <Share2 className="w-3.5 h-3.5 text-[#2FC191]" />
                <span>Instant Sharing Channels</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs space-y-3.5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-base border border-emerald-100 shadow-2xs">
                  02
                </div>
                <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">
                  2. Friends Sign Up
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  When your friends create their ProTippz account using your link, they join our passionate collegiate sports community.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Fan Community</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs space-y-3.5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-base border border-amber-100 shadow-2xs">
                  03
                </div>
                <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">
                  3. Earn & Redeem Points
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Receive +10 reward points per referral automatically credited to your vault. Redeem them in the Rewardz store for prizes.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-amber-600">
                <Gift className="w-3.5 h-3.5" />
                <span>+10 Pts per Successful Signup</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── PURE TAILWIND POPUP MODAL (NO antd) ─── */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setOpenModal(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden z-10 p-6 sm:p-7 text-center animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Success Icon */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Referral Link Ready!
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Copy your unique link or share it directly to earn 10 points per friend.
            </p>

            {/* Link Box */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-2 mb-5">
              <span className="text-xs font-mono text-slate-700 truncate select-all">
                {inviteLink}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-[#053697] hover:bg-[#042873] text-white text-xs font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#2FC191]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Social Share Grid */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2.5">
                Share Via
              </span>
              <div className="flex items-center justify-center gap-2.5">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `${shareText} ${inviteLink}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] flex items-center justify-center transition-colors"
                  title="Share on WhatsApp"
                >
                  <FaWhatsapp className="w-5 h-5 text-[#25D366]" />
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    shareText
                  )}&url=${encodeURIComponent(inviteLink)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 flex items-center justify-center transition-colors"
                  title="Share on X"
                >
                  <FaTwitter className="w-4 h-4 text-slate-700" />
                </a>

                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(
                    "Join me on PROTIPPZ!"
                  )}&body=${encodeURIComponent(
                    `Hi,\n\nJoin me on PROTIPPZ: ${inviteLink}\n\nCheers!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200/60 text-rose-700 flex items-center justify-center transition-colors"
                  title="Share via Gmail"
                >
                  <MdEmail className="w-5 h-5 text-rose-600" />
                </a>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    inviteLink
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200/60 text-[#053697] flex items-center justify-center transition-colors"
                  title="Share on Facebook"
                >
                  <FaFacebookF className="w-4 h-4 text-[#053697]" />
                </a>

                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(
                    inviteLink
                  )}&text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200/60 text-sky-700 flex items-center justify-center transition-colors"
                  title="Share on Telegram"
                >
                  <FaTelegramPlane className="w-4 h-4 text-sky-500" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteFriendsPage;
