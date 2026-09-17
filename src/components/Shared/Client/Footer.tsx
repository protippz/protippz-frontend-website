"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
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
import logo from "@/Assets/logo.png";
import appsore from "@/Assets/appsore.png";
import playstore from "@/Assets/playstore.png";
import qrCode from "@/Assets/qrcode.png";
import toast from "react-hot-toast";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const platformLinks = [
    { name: "Tippz", href: "/tippz" },
    { name: "Playerz", href: "/playerz" },
    { name: "Teamz", href: "/teamz" },
    { name: "Media & Community", href: "/community" },
    { name: "Rewardz", href: "/rewardz" },
    { name: "Official Store", href: "https://protippz.store", external: true },
    { name: "Sports News", href: "/sports-news" },
  ];

  const fanHubLinks = [
    { name: "Deposit Funds", href: "/deposit" },
    { name: "Tippz History", href: "/tippz-history" },
    { name: "Transaction Log", href: "/transaction-log" },
    { name: "My Favorites", href: "/favorites" },
    { name: "Invite Friends", href: "/invite-friends" },
    { name: "Help & FAQs", href: "/faqs" },
  ];

  const legalLinks = [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Contact Support", href: "/contact" },
    { name: "Delete Account", href: "/delete-account" },
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
    <footer className="relative bg-gradient-to-b from-[#071f50] via-[#05183f] to-[#020b1d] text-white pt-16 pb-24 md:pb-16 overflow-hidden border-t-4 border-[#2FC191]">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2FC191]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#053697]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-355 mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================= NEWSLETTER & COMMUNITY CTA CARD ================= */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0a296b]/90 via-[#062054]/90 to-[#08235a]/90 border border-white/15 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-md mb-16 overflow-hidden">
          {/* Decorative Corner Light */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#2FC191]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2FC191]/15 border border-[#2FC191]/30 text-[#2FC191] text-xs font-bold tracking-wide uppercase">
                <Zap className="w-3.5 h-3.5" />
                Stay Ahead of the Game
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Join the <span className="text-[#2FC191]">PROTIPPZ</span> Movement
              </h3>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Receive instant tipping updates, exclusive athlete reward drops, NIL news, and special community perks straight to your inbox.
              </p>

              {/* Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-[#2FC191]" /> 100% Direct Athlete Support
                </span>
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <Award className="w-4 h-4 text-[#2FC191]" /> NIL Compliant
                </span>
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-[#2FC191]" /> No Spam, Cancel Anytime
                </span>
              </div>
            </div>

            {/* Newsletter Input */}
            <div className="lg:col-span-5 w-full">
              {isSubscribed ? (
                <div className="p-4 rounded-2xl bg-[#2FC191]/15 border border-[#2FC191]/30 text-emerald-200 text-sm font-semibold flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2FC191] shrink-0" />
                  <span>You are subscribed! Welcome to the ProTippz community.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      required
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#2FC191] focus:ring-2 focus:ring-[#2FC191]/30 transition-all backdrop-blur-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3.5 rounded-xl bg-[#2FC191] hover:bg-[#28ad81] active:scale-95 text-[#041738] font-bold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-[#2FC191]/25 flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="animate-pulse">Subscribing...</span>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ================= MAIN NAVIGATION GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block group">
              <div className="p-2.5 bg-white rounded-2xl inline-block shadow-md group-hover:shadow-lg transition-transform group-hover:scale-105 duration-200">
                <Image
                  src={logo}
                  alt="PROTIPPZ"
                  width={140}
                  height={45}
                  className="h-9 w-auto object-contain"
                />
              </div>
            </Link>

            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              The ultimate sports fan engagement platform. Directly tip your favorite athletes, back collegiate & pro stars, discover top talent, and unlock exclusive rewards.
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
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#2FC191] hover:text-[#041738] text-slate-200 flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-[#2FC191] hover:scale-110 active:scale-95 shadow-xs"
                    title={item.name}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2FC191]" />
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : "_self"}
                    className="text-slate-300 hover:text-[#2FC191] transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#2FC191] group-hover:translate-x-0.5 transition-transform" />
                    <span>{link.name}</span>
                    {link.external && (
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#2FC191]" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Fan Hub */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2FC191]" />
              Fan Hub
            </h4>
            <ul className="space-y-2.5 text-sm">
              {fanHubLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-[#2FC191] transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#2FC191] group-hover:translate-x-0.5 transition-transform" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Legal & Support */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2FC191]" />
              Legal & Help
            </h4>
            <ul className="space-y-2.5 text-sm">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-[#2FC191] transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#2FC191] group-hover:translate-x-0.5 transition-transform" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#2FC191]/20 border border-white/15 hover:border-[#2FC191] text-xs font-semibold text-slate-200 hover:text-white transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-[#2FC191]" />
                <span>Contact Support</span>
              </Link>
            </div>
          </div>

          {/* Col 5: App Download & QR Code */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-[#2FC191]" />
              Get the App
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Scan or tap below to download PROTIPPZ for iOS & Android.
            </p>

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2.5 rounded-2xl">
              <div className="bg-white p-1 rounded-xl shrink-0">
                <Image
                  src={qrCode}
                  alt="QR Code"
                  width={56}
                  height={56}
                  className="w-14 h-14 object-contain"
                />
              </div>
              <div className="flex flex-col gap-1.5 min-w-0">
                <a
                  href="https://play.google.com/store/apps/details?id=com.protipz.cory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105"
                  aria-label="Get on Google Play"
                >
                  <Image
                    src={playstore}
                    alt="Google Play"
                    width={96}
                    height={28}
                    className="h-6 w-auto object-contain"
                  />
                </a>
                <a
                  href="https://apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105"
                  aria-label="Download on App Store"
                >
                  <Image
                    src={appsore}
                    alt="App Store"
                    width={96}
                    height={28}
                    className="h-6 w-auto object-contain"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>© {currentYear} PROTIPPZ. All rights reserved.</p>
            <span className="hidden sm:inline-block text-slate-600">•</span>
            <p className="text-slate-400">
              NIL Compliant • Real-time athlete tips • Direct fan connection
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-slate-300">
              <Link href="/privacy" className="hover:text-[#2FC191] transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-[#2FC191] transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-[#2FC191] transition-colors">
                Support
              </Link>
            </div>

            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-[#2FC191] hover:text-[#041738] text-slate-300 transition-all duration-200 border border-white/10 hover:border-[#2FC191] cursor-pointer active:scale-95 shadow-xs"
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
