"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  Sparkles,
  Mail,
  Package,
  Coins,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Phone,
  User,
  MapPin,
  Building,
  KeyRound,
} from "lucide-react";
import toast from "react-hot-toast";
import { post, imageUrl } from "@/ApisRequests/server";
import { RewardInterface } from "@/app/(default)/rewardz/page";
import { useContextData } from "@/provider/ContextProvider";
import { useRedeemRequesteMutation } from "@/Redux/Apis/redeemApis"

interface SendTipsButtonProps {
  item: RewardInterface;
  className?: string;
  buttonText?: React.ReactNode;
}

type ModalStep = "guide" | "email" | "otp" | "shipping" | "success";

const OTP_LENGTH = 5;

const RedeemButton: React.FC<SendTipsButtonProps> = ({
  item,
  className,
  buttonText,
}) => {
  const router = useRouter();
  const authData = useContextData();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<ModalStep>("guide");
  const [loading, setLoading] = useState(false);

  // Email delivery state
  const [email, setEmail] = useState("");
  const [redeemId, setRedeemId] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [redeemRequest, { }] = useRedeemRequesteMutation();

  // Shipping address state
  const [shipping, setShipping] = useState({
    userName: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const isEmailDelivery = item?.category?.deliveryOption === "Email";

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Pre-fill user data when modal opens
  useEffect(() => {
    if (isOpen && authData?.userData) {
      const user = authData.userData;
      if (user.email) setEmail(user.email);
      setShipping((prev) => ({
        ...prev,
        userName: prev.userName || user.name || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [isOpen, authData]);

  // Auto-focus first OTP slot when entering OTP step
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  // Open modal handler
  const handleOpenModal = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Please sign in to redeem rewards");
      router.push("/sign-in");
      return;
    }

    setStep("guide");
    setOtp(Array(OTP_LENGTH).fill(""));
    setIsOpen(true);
  };

  // Close and reset modal
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep("guide");
      setLoading(false);
      setOtp(Array(OTP_LENGTH).fill(""));
    }, 200);
  };

  // Guide -> Next step
  const handleGuideNext = () => {
    if (isEmailDelivery) {
      setStep("email");
    } else {
      setStep("shipping");
    }
  };

  // 1. Submit Email for digital redemption
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await post(
        "/redeem-request/create",
        {
          reward: item?._id,
          category: item?.category?._id,
          email: trimmedEmail,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setLoading(false);
      if (res?.success) {
        setRedeemId(res?.data?._id || "");
        toast.success(res?.message || "Verification code sent to your email!");
        setStep("otp");
      } else {
        toast.error(res?.message || "Failed to initiate redemption. Please try again.");
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message || "An unexpected error occurred. Please try again.");
    }
  };

  // 2. Submit OTP for digital redemption
  const handleOtpChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, "");
    if (!cleaned) {
      const next = [...otp];
      next[index] = "";
      setOtp(next);
      return;
    }

    const digit = cleaned.slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    if (index < OTP_LENGTH - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      e.preventDefault();
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;

    const digits = pasted.slice(0, OTP_LENGTH).split("");
    const next = [...otp];
    digits.forEach((d, i) => {
      next[i] = d;
    });
    setOtp(next);

    const targetIdx = Math.min(digits.length, OTP_LENGTH) - 1;
    otpInputRefs.current[targetIdx]?.focus();
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      toast.error(`Please enter the complete ${OTP_LENGTH}-digit code`);
      return;
    }

    setLoading(true);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await post(
        `/redeem-request/verify-redeem-email/${redeemId}`,
        { verifyCode: Number(code) },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setLoading(false);
      if (res?.success) {
        toast.success(res?.message || "Email verified successfully!");
        setStep("success");
      } else {
        toast.error(res?.message || "Invalid or expired verification code.");
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message || "Verification failed. Please try again.");
    }
  };

  // 3. Submit Shipping Address for physical delivery
  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shipping.userName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!shipping.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!shipping.streetAddress.trim()) {
      toast.error("Please enter your street address");
      return;
    }
    if (!shipping.city.trim()) {
      toast.error("Please enter your city");
      return;
    }
    if (!shipping.state.trim()) {
      toast.error("Please enter your state");
      return;
    }
    if (!shipping.zipCode.trim()) {
      toast.error("Please enter your zip code");
      return;
    }

    setLoading(true);
    try {
      const data = {
        reward: item?._id,
        category: item?.category?._id,
        userName: shipping.userName.trim(),
        phone: shipping.phone.trim(),
        streetAddress: shipping.streetAddress.trim(),
        city: shipping.city.trim(),
        state: shipping.state.trim(),
        zipCode: shipping.zipCode.trim(),
      }
      const res = await redeemRequest(data).unwrap()

      setLoading(false);
      if (res?.success) {
        toast.success(res?.message || "Shipping details submitted successfully!");
        setStep("success");
      } else {
        toast.error(res?.message || "Failed to submit shipping details.");
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message || "Submission failed. Please try again.");
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleOpenModal}
        className={
          className ||
          "bg-[#053697] text-white font-bold py-2 px-4 rounded-xl hover:bg-[#042870] active:scale-[0.98] transition-all cursor-pointer"
        }
      >
        {buttonText || "Redeem"}
      </button>

      {/* Modern Mac-Style Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Dismiss backdrop click */}
          <div className="fixed inset-0" onClick={handleClose} />

          {/* Modal Card */}
          <div
            className="relative bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-[28px] max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 z-10 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 sm:right-5 top-4 sm:top-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Reward Summary Snippet */}
            <div className="flex items-center gap-2 p-3 mb-5 bg-slate-50/80 rounded-2xl border border-slate-100">
              <div className="relative w-12 h-12 rounded-xl bg-slate-900 shrink-0 overflow-hidden flex items-center justify-center">
                {item?.reward_image ? (
                  <Image
                    src={imageUrl(item.reward_image)}
                    alt={item?.name || "Reward"}
                    fill
                    className="object-contain p-1"
                  />
                ) : (
                  <Sparkles className="w-5 h-5 text-[#2FC191]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-slate-900 truncate">
                  {item?.name || "Reward"}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#053697]">
                    <Coins className="w-3.5 h-3.5 text-amber-500" />
                    <span>{item?.pointRequired?.toLocaleString() ?? 0} Pts</span>
                  </span>
                  <span className="text-[10px] text-slate-400">•</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 capitalize">
                    {isEmailDelivery ? (
                      <Mail className="w-3 h-3 text-[#053697]" />
                    ) : (
                      <Package className="w-3 h-3 text-[#053697]" />
                    )}
                    <span>{item?.category?.deliveryOption || "Standard"}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* ================= STEP 1: GUIDE MODAL ================= */}
            {step === "guide" && (
              <div className="space-y-4">
                <div className="text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#053697]/10 text-[#053697] text-[11px] font-bold uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>How to Claim Prize</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-[#053697] tracking-tight">
                    {isEmailDelivery
                      ? "Digital Delivery Instructions"
                      : "Mailing & Shipping Guidelines"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Please review the redemption process before continuing.
                  </p>
                </div>

                <div className="space-y-3 pt-1 text-xs text-slate-600 leading-relaxed">
                  {isEmailDelivery ? (
                    <>
                      <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
                        <p className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-[#053697]/10 text-[#053697] flex items-center justify-center text-[10px] font-black shrink-0">
                            1
                          </span>
                          Verify Your Delivery Email
                        </p>
                        <p className="text-slate-500 pl-6.5">
                          Enter your verified email address to receive your 5-digit security code. This step guarantees digital assets like tickets and digital codes are delivered to you securely.
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
                        <p className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-[#053697]/10 text-[#053697] flex items-center justify-center text-[10px] font-black shrink-0">
                            2
                          </span>
                          Instant Confirmation & Ticket Dispatch
                        </p>
                        <p className="text-slate-500 pl-6.5">
                          Once confirmed, your tickets, voucher, or digital reward details will be dispatched directly to your inbox.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
                        <p className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-[#053697]/10 text-[#053697] flex items-center justify-center text-[10px] font-black shrink-0">
                            1
                          </span>
                          Accurate Mailing Details
                        </p>
                        <p className="text-slate-500 pl-6.5">
                          Please provide your complete legal name, phone number, and physical mailing address (street, city, state, zip) to prevent carrier delays.
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
                        <p className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-[#053697]/10 text-[#053697] flex items-center justify-center text-[10px] font-black shrink-0">
                            2
                          </span>
                          Tracking & Shipping Dispatch
                        </p>
                        <p className="text-slate-500 pl-6.5">
                          Once processed, your physical merchandise will be dispatched via courier and tracking info will be sent to your email.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleGuideNext}
                    className="w-full h-11 rounded-full bg-[#053697] hover:bg-[#042870] active:scale-[0.99] text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Proceed to Claim</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 2: EMAIL INPUT (DIGITAL) ================= */}
            {step === "email" && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="text-left">
                  <button
                    type="button"
                    onClick={() => setStep("guide")}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-[#053697] mb-2 cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to instructions</span>
                  </button>
                  <h3 className="text-lg sm:text-xl font-black text-[#053697] tracking-tight">
                    Verify Delivery Email
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter the email address where your prize details should be delivered.
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-bold text-slate-700 px-1">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#053697] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="w-full h-11 rounded-full bg-[#053697] hover:bg-[#042870] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Sending Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Verification Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ================= STEP 3: OTP VERIFICATION (DIGITAL) ================= */}
            {step === "otp" && (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="text-center">
                  <div className="mx-auto w-11 h-11 rounded-2xl bg-[#053697]/10 text-[#053697] flex items-center justify-center mb-2.5">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-[#053697] tracking-tight">
                    Enter Verification Code
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    We sent a 5-digit verification code to
                  </p>
                  <div className="inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate max-w-[220px]">{email}</span>
                  </div>
                </div>

                {/* 5 Squircle Input Slots */}
                <div className="flex items-center justify-center gap-2 sm:gap-2.5 pt-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className="w-11 h-12 sm:w-12 sm:h-13 rounded-xl border border-slate-200 bg-slate-50/60 text-center text-lg font-black text-slate-800 focus:outline-none focus:border-[#053697] focus:bg-white transition-all"
                      aria-label={`Digit ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || otp.some((d) => !d.trim())}
                    className="w-full h-11 rounded-full bg-[#053697] hover:bg-[#042870] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify & Claim Prize</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="text-[11px] font-bold text-[#053697] hover:underline cursor-pointer"
                  >
                    Change email address
                  </button>
                </div>
              </form>
            )}

            {/* ================= STEP 4: SHIPPING ADDRESS (PHYSICAL) ================= */}
            {step === "shipping" && (
              <form onSubmit={handleShippingSubmit} className="space-y-3.5">
                <div className="text-left">
                  <button
                    type="button"
                    onClick={() => setStep("guide")}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-[#053697] mb-1 cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to instructions</span>
                  </button>
                  <h3 className="text-lg sm:text-xl font-black text-[#053697] tracking-tight">
                    Shipping & Mailing Address
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Provide the physical address where your reward should be delivered.
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 px-1">
                      Full Legal Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        value={shipping.userName}
                        onChange={(e) =>
                          setShipping({ ...shipping, userName: e.target.value })
                        }
                        placeholder="John Doe"
                        required
                        className="w-full h-10 pl-10 pr-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#053697] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 px-1">
                      Phone Number
                    </label>
                    <div className="relative flex items-center">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="tel"
                        value={shipping.phone}
                        onChange={(e) =>
                          setShipping({ ...shipping, phone: e.target.value })
                        }
                        placeholder="+1 (555) 000-0000"
                        required
                        className="w-full h-10 pl-10 pr-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#053697] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Street Address */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 px-1">
                      Street Address
                    </label>
                    <div className="relative flex items-center">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        value={shipping.streetAddress}
                        onChange={(e) =>
                          setShipping({
                            ...shipping,
                            streetAddress: e.target.value,
                          })
                        }
                        placeholder="123 Main St, Apt 4B"
                        required
                        className="w-full h-10 pl-10 pr-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#053697] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* City & State (2 columns) */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 px-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={shipping.city}
                        onChange={(e) =>
                          setShipping({ ...shipping, city: e.target.value })
                        }
                        placeholder="Los Angeles"
                        required
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#053697] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 px-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={shipping.state}
                        onChange={(e) =>
                          setShipping({ ...shipping, state: e.target.value })
                        }
                        placeholder="California"
                        required
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#053697] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Zip Code */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 px-1">
                      Zip / Postal Code
                    </label>
                    <input
                      type="text"
                      value={shipping.zipCode}
                      onChange={(e) =>
                        setShipping({ ...shipping, zipCode: e.target.value })
                      }
                      placeholder="90001"
                      required
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#053697] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-full bg-[#053697] hover:bg-[#042870] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Submitting Address...</span>
                      </>
                    ) : (
                      <>
                        <Package className="w-4 h-4" />
                        <span>Confirm & Submit Address</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ================= STEP 5: SUCCESS CONFIRMATION ================= */}
            {step === "success" && (
              <div className="py-6 px-2 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="relative mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-[#2FC191]" />
                  <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-black text-[#053697]">
                    Redemption Request Sent!
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    {isEmailDelivery
                      ? "Your digital prize claim has been verified. Tickets and redemption details have been dispatched to your email."
                      : "Your mailing address has been recorded. You will receive carrier tracking information once your package ships."}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 max-w-sm mx-auto">
                  <span className="font-bold text-slate-800">Prize: </span>
                  <span>{item?.name}</span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full h-11 rounded-full bg-[#053697] hover:bg-[#042870] active:scale-[0.99] text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RedeemButton;
