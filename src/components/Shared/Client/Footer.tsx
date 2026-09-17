"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import {
  ArrowUp,
  Mail,
  ShieldCheck,
  Zap,
  Award,
  ExternalLink,
  ChevronRight,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import { IMAGE } from "@/constant/image.index";
import playstore from "@/Assets/playstore.png";
import qrCode from "@/Assets/qrcode.png";
import toast from "react-hot-toast";
import { useContextData } from "@/provider/ContextProvider";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.coryrains.protppz&hl=en";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const authData = useContextData();
  const isLoggedIn = Boolean(authData?.userData?._id);
  const userRole = authData?.userData?.user?.role;
  const isPlayerOrTeam = userRole === "player" || userRole === "team";

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubscribed(true);
      setEmail("");
      toast.success("Thank you for subscribing to PROTIPPZ updates!");
    }, 600);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const currentYear = new Date().getFullYear();

  // Public platform routes accessible without login
  const platformLinks = [
    { name: "TIPPZ", href: "/tippz" },
    { name: "PLAYERZ", href: "/playerz" },
    { name: "TEAMZ", href: "/teamz" },
    { name: "MEDIA & COMMUNITY", href: "/community" },
    { name: "REWARDZ", href: "/rewardz" },
    { name: "STORE", href: "https://protippz.store", external: true },
  ];

  // Protected routes only displayed when user is logged in
  const userHubLinks = isPlayerOrTeam
    ? [
        { name: "Athlete Dashboard", href: "/home" },
        { name: "My Tip History", href: "/my-tip-history" },
        { name: "Withdraw Earnings", href: "/player-withdraw" },
        { name: "Address Info", href: "/address" },
        { name: "Tax Information", href: "/tax-information" },
        { name: "Help & FAQs", href: "/faqs" },
      ]
    : [
        { name: "My Profile", href: "/profile" },
        { name: "Deposit Funds", href: "/deposit" },
        { name: "Tippz History", href: "/tippz-history" },
        { name: "Transaction Log", href: "/transaction-log" },
        { name: "My Favorites", href: "/favorites" },
        { name: "Invite Friends", href: "/invite-friends" },
        { name: "Help & FAQs", href: "/faqs" },
      ];

  const hubTitle = isPlayerOrTeam ? "Athlete Hub" : "Fan Hub";

  // Legal and support links
  const legalLinks = [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Contact Support", href: "/contact" },
    ...(isLoggedIn
      ? [
          { name: "Change Password", href: "/change-password" },
          { name: "Delete Account", href: "/delete-account" },
        ]
      : []),
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61566917812469",
      icon: <FaFacebookF className="w-4 h-4" />,
    },
    {
      name: "X (Twitter)",
      href: "https://x.com/protippz",
      icon: <FaTwitter className="w-4 h-4" />,
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/protippz/",
      icon: <FaInstagram className="w-4 h-4" />,
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/@PROTIPPZ",
      icon: <FaYoutube className="w-4 h-4" />,
    },
  ];

  return (
    <footer className="relative mt-4 bg-slate-50 text-slate-800 pt-16 pb-24 md:pb-16 overflow-hidden border-t border-slate-200/80">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2FC191]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#053697]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-355 mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================= MAIN NAVIGATION GRID (LIGHT MODE) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-slate-200">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block group">
              <div className="p-2 bg-white rounded-xl inline-block border border-slate-200/80 shadow-xs transition-all duration-200">
                <Image
                  src={IMAGE.logo}
                  alt="PROTIPPZ"
                  width={140}
                  height={45}
                  className="h-8 w-auto object-contain"
                />
              </div>
            </Link>

            <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
              The ultimate sports fan engagement platform. Directly tip your
              favorite athletes, back collegiate & pro stars, discover top
              talent, and unlock exclusive rewards.
            </p>

            {/* Social Icons */}
            <div className="space-y-2.5 pt-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Connect With Us
              </span>
              <div className="flex flex-wrap gap-2.5">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.name}
                    className="w-9 h-9 rounded-xl bg-white hover:bg-[#2FC191] hover:text-white text-slate-600 flex items-center justify-center transition-all duration-200 border border-slate-200/90 hover:border-[#2FC191] hover:scale-110 active:scale-95 shadow-xs"
                    title={item.name}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Col 2: Platform Links (Always Visible: TIPPZ, PLAYERZ, TEAMZ, MEDIA & COMMUNITY, REWARDZ, STORE) */}
          <div
            className={
              isLoggedIn ? "lg:col-span-2 space-y-4" : "lg:col-span-3 space-y-4"
            }
          >
            <h4 className="text-sm font-bold text-[#053697] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2FC191]" />
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : "_self"}
                    className="text-slate-600 hover:text-[#053697] hover:font-medium transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#2FC191] group-hover:translate-x-0.5 transition-transform" />
                    <span>{link.name}</span>
                    {link.external && (
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#053697]" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Fan Hub / Athlete Hub (ONLY Rendered When User Is Logged In) */}
          {isLoggedIn && (
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-sm font-bold text-[#053697] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2FC191]" />
                {hubTitle}
              </h4>
              <ul className="space-y-2.5 text-sm">
                {userHubLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-slate-600 hover:text-[#053697] hover:font-medium transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#2FC191] group-hover:translate-x-0.5 transition-transform" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Col 4: Legal & Support */}
          <div
            className={
              isLoggedIn ? "lg:col-span-2 space-y-4" : "lg:col-span-2 space-y-4"
            }
          >
            <h4 className="text-sm font-bold text-[#053697] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2FC191]" />
              Legal & Help
            </h4>
            <ul className="space-y-2.5 text-sm">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-600 hover:text-[#053697] hover:font-medium transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#2FC191] group-hover:translate-x-0.5 transition-transform" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-[#2FC191]/10 border border-slate-200 hover:border-[#2FC191] text-xs font-semibold text-slate-700 hover:text-[#053697] transition-all shadow-xs"
              >
                <Mail className="w-3.5 h-3.5 text-[#2FC191]" />
                <span>Contact Support</span>
              </Link>
            </div>
          </div>

          {/* Col 5: App Download & QR Code (Google Play Store) */}
          <div
            className={
              isLoggedIn ? "lg:col-span-2 space-y-4" : "lg:col-span-3 space-y-4"
            }
          >
            <h4 className="text-sm font-bold text-[#053697] uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-[#2FC191]" />
              Get the App
            </h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Scan or tap below to download PROTIPPZ on Google Play.
            </p>

            <div className="flex items-center gap-3 bg-white border border-slate-200 p-2.5 rounded-2xl shadow-xs">
              <div className="bg-slate-50 p-1 rounded-xl shrink-0 border border-slate-100">
                <Image
                  src={qrCode}
                  alt="QR Code"
                  width={56}
                  height={56}
                  className="w-14 h-14 object-contain"
                />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105 inline-block"
                  aria-label="Get on Google Play"
                >
                  <Image
                    src={playstore}
                    alt="Google Play"
                    width={110}
                    height={32}
                    className="h-7 w-auto object-contain"
                  />
                </a>
                <span className="text-[11px] text-slate-400 font-medium">
                  Available on Google Play
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM BAR (LIGHT MODE) ================= */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>© {currentYear} PROTIPPZ. All rights reserved.</p>
            <span className="hidden sm:inline-block text-slate-300">•</span>
            <p className="text-slate-500">
              NIL Compliant • Real-time athlete tips • Direct fan connection
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-slate-600">
              <Link
                href="/privacy"
                className="hover:text-[#053697] transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-[#053697] transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/contact"
                className="hover:text-[#053697] transition-colors"
              >
                Support
              </Link>
              <Link
                href="/faqs"
                className="hover:text-[#053697] transition-colors"
              >
                FAQs
              </Link>
            </div>

            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-white hover:bg-[#2FC191] hover:text-white text-slate-600 transition-all duration-200 border border-slate-200 hover:border-[#2FC191] cursor-pointer active:scale-95 shadow-xs"
              title="Back to Top"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
