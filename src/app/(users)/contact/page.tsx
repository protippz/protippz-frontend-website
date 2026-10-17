"use client";

import React, { useState } from "react";
import Link from "next/link";
import { post } from "@/ApisRequests/server";
import toast from "react-hot-toast";
import GoToTop from "@/components/ui/GoToTop";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  User,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const INQUIRY_TOPICS = [
  "General Inquiry",
  "Tipping & Wallet",
  "Athlete / Team NIL",
  "Technical Support",
];

const ContactUsPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("General Inquiry");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter your message");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: `[Topic: ${topic}] ${message.trim()}`,
      };

      const res = await post("/contact-us", payload);

      if (
        res?.message === "Contact email sent successfully" ||
        res?.success ||
        res?.status === 200
      ) {
        toast.success(res?.message || "Message sent successfully!");
        setIsSuccess(true);
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        toast.error(res?.message || "Failed to send message. Please try again.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#fcfbf9] via-white to-[#f5f8fa] py-8 sm:py-12 pb-20">
      <GoToTop />

      <div className="max-w-355 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5 font-mono text-xs font-bold text-[#053697]">
              <span className="w-2 h-2 rounded-full bg-[#2FC191]" />
              <span>[SUPPORT HUB: GET IN TOUCH]</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Contact Us
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl">
              Have questions about tipping student-athletes, NIL partnerships, or your ProTippz wallet? We&apos;re here to help.
            </p>
          </div>

          <Link
            href="/faqs"
            className="inline-flex items-center gap-1.5 self-start sm:self-auto text-xs font-bold text-[#053697] bg-blue-50/80 hover:bg-blue-100/80 px-4 py-2.5 rounded-xl border border-blue-100 transition-colors shadow-2xs"
          >
            <HelpCircle className="w-4 h-4 text-[#2FC191]" />
            <span>Browse FAQs</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
          </Link>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ─── LEFT COLUMN: Direct Support Information (5 of 12 cols) ─── */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Support Card */}
            <div className="bg-[#053697] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm border border-[#053697]">
              <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute right-10 top-2 w-32 h-32 rounded-full bg-[#2FC191]/15 blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2FC191]" />
                  Dedicated Customer Care
                </span>

                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                  We&apos;re committed to supporting fans and collegiate athletes.
                </h2>

                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
                  Our direct support desk handles inquiries regarding transactions, athlete roster onboarding, and collegiate athletic compliance.
                </p>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-blue-200">
                  <span>Average Response Time</span>
                  <span className="font-bold text-[#2FC191]">Under 24 Hours</span>
                </div>
              </div>
            </div>

            {/* Direct Contact Channels Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-2xs space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Contact Details
              </h3>

              <div className="space-y-4">
                {/* Email Support */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#053697] flex items-center justify-center shrink-0 border border-blue-100/60 shadow-2xs">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-500">
                      Email Inquiries
                    </p>
                    <a
                      href="mailto:support@protippz.com"
                      className="text-sm font-bold text-slate-900 hover:text-[#053697] transition-colors truncate block"
                    >
                      support@protippz.com
                    </a>
                  </div>
                </div>

                {/* Partnerships */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/60 shadow-2xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-500">
                      NIL & Team Partnerships
                    </p>
                    <a
                      href="mailto:partnerships@protippz.com"
                      className="text-sm font-bold text-slate-900 hover:text-[#053697] transition-colors truncate block"
                    >
                      partnerships@protippz.com
                    </a>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 border border-slate-100 shadow-2xs">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-500">
                      Support Hours
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      Monday – Friday: 9AM – 6PM EST
                    </p>
                  </div>
                </div>

                {/* Headquarters Location */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 border border-slate-100 shadow-2xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-500">
                      Headquarters
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      United States (Online NIL Platform)
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700 mb-2.5">
                  Follow PROTIPPZ on Social Media
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href="https://x.com/protippz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl border border-slate-200 hover:border-[#053697] hover:bg-blue-50 text-slate-600 hover:text-[#053697] flex items-center justify-center transition-colors shadow-2xs"
                    aria-label="X Twitter"
                  >
                    <FaTwitter className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://www.instagram.com/protippz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl border border-slate-200 hover:border-[#053697] hover:bg-blue-50 text-slate-600 hover:text-[#053697] flex items-center justify-center transition-colors shadow-2xs"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://www.youtube.com/@PROTIPPZ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl border border-slate-200 hover:border-[#053697] hover:bg-blue-50 text-slate-600 hover:text-[#053697] flex items-center justify-center transition-colors shadow-2xs"
                    aria-label="YouTube"
                  >
                    <FaYoutube className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=61566917812469"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl border border-slate-200 hover:border-[#053697] hover:bg-blue-50 text-slate-600 hover:text-[#053697] flex items-center justify-center transition-colors shadow-2xs"
                    aria-label="Facebook"
                  >
                    <FaFacebookF className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: Interactive Contact Form (7 of 12 cols) ─── */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_12px_45px_rgba(0,0,0,0.04)] relative">
              {isSuccess ? (
                /* Success Confirmation State */
                <div className="py-12 px-4 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to PROTIPPZ. Our support team has received your message and will review it promptly.
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => setIsSuccess(false)}
                      className="px-6 py-2.5 rounded-xl bg-[#053697] hover:bg-[#042873] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                /* Main Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Send Us a Message
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Complete the form below and we will get back to you as soon as possible.
                    </p>
                  </div>

                  {/* Inquiry Topic Selector */}
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-2">
                      Inquiry Topic
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {INQUIRY_TOPICS.map((item) => {
                        const isSelected = topic === item;
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setTopic(item)}
                            className={`h-10 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer truncate ${
                              isSelected
                                ? "bg-[#053697] text-white shadow-xs"
                                : "bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700"
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name Field */}
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        required
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:border-[#053697] focus:ring-2 focus:ring-[#053697]/15 outline-none text-slate-900 text-sm transition-all"
                      />
                    </div>
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email Field */}
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:border-[#053697] focus:ring-2 focus:ring-[#053697]/15 outline-none text-slate-900 text-sm transition-all"
                        />
                      </div>
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                        Phone Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:border-[#053697] focus:ring-2 focus:ring-[#053697]/15 outline-none text-slate-900 text-sm transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Message <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us how we can help you with your account, athlete tipping, or team inquiries..."
                        required
                        className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:border-[#053697] focus:ring-2 focus:ring-[#053697]/15 outline-none text-slate-900 text-sm transition-all resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Privacy & Compliance Assurance */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2 text-xs text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-[#2FC191] shrink-0 mt-0.5" />
                    <span className="leading-snug">
                      Your information is protected under our{" "}
                      <Link href="/privacy" className="text-[#053697] underline font-medium">
                        Privacy Policy
                      </Link>
                      . We never sell or share contact details with unauthorized third parties.
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-[#053697] hover:bg-[#042873] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Message</span>
                        <Send className="w-4 h-4 text-[#2FC191]" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
