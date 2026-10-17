"use client";

import React, { memo, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { imageUrl, post } from "@/ApisRequests/server";
import toast from "react-hot-toast";
import { TeamInterface } from "@/app/(default)/teamz/page";
import { useContextData } from "@/provider/ContextProvider";
import Swal from "sweetalert2";
import defaultTeamLogo from "@/Assets/team.webp";
import {
  X,
  DollarSign,
  Wallet,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Check,
  Loader2,
  ShieldCheck,
} from "lucide-react";

interface SendTipsButtonProps {
  item: TeamInterface;
  token: string | undefined | null;
  className?: string;
  buttonText?: React.ReactNode;
  children?:
    | React.ReactNode
    | ((actions: {
        openTip: () => void;
        openDetails: () => void;
      }) => React.ReactNode);
}

const PRESET_AMOUNTS = [5, 10, 25, 50, 100];

const SendTipsButton: React.FC<SendTipsButtonProps> = ({
  token,
  item,
  className,
  buttonText,
  children,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(25);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [amount, setAmount] = useState<string>("25");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isOopsModalOpen, setIsOopsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"deposit" | "credit">(
    "deposit"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const data = useContextData();
  const router = useRouter();

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCancel();
      }
    };
    if (isModalOpen || isPaymentModalOpen || isOopsModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, isPaymentModalOpen, isOopsModalOpen]);

  const navigateToLogin = () => {
    router.push("/sign-in");
  };

  const openTip = () => {
    if (!data?.userData?.user) {
      return Swal.fire({
        title: "You need to log in!",
        text: "Please log in to send digital tips to teams.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Go to Login",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#053697",
      }).then((result) => {
        if (result.isConfirmed) {
          navigateToLogin();
        }
      });
    }
    setSelectedPreset(25);
    setCustomAmount("");
    setAmount("25");
    setIsModalOpen(true);
  };

  const openDetails = () => {
    if (item?._id) {
      router.push(`/teamz/${item._id}`);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsPaymentModalOpen(false);
    setIsOopsModalOpen(false);
    setIsSubmitting(false);
  };

  const handlePresetSelect = (val: number) => {
    setSelectedPreset(val);
    setCustomAmount("");
    setAmount(String(val));
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, "");
    setCustomAmount(val);
    setSelectedPreset(null);
    setAmount(val);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = Number(amount);
    if (!finalAmount || finalAmount <= 0) {
      return toast.error("Please enter a valid tip amount");
    }
    setIsModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async () => {
    if (paymentMethod === "deposit") {
      setIsSubmitting(true);
      try {
        const storedToken =
          typeof localStorage !== "undefined"
            ? localStorage.getItem("token")
            : "";

        const res = await post(
          "/tip/create",
          {
            entityId: item?._id,
            entityType: "Team",
            amount: Number(amount),
            tipBy: "Profile balance",
          },
          {
            headers: {
              Authorization: `${storedToken || token || ""}`,
            },
          }
        );

        if (res?.success) {
          toast.success(res?.message || "Tip sent successfully!");
          setIsPaymentModalOpen(false);
          router.refresh();
        } else {
          toast.error(res?.message || "Failed to process tip");
          setIsPaymentModalOpen(false);
          setIsOopsModalOpen(true);
        }
      } catch (error) {
        toast.error("An error occurred while processing your tip");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsPaymentModalOpen(false);
      router.push(
        `/send-tip?amount=${amount}&entityType=Team&entityId=${item?._id}`
      );
    }
  };

  const teamLogoSrc = item?.team_logo
    ? imageUrl(item.team_logo)
    : item?.team_bg_image
    ? imageUrl(item.team_bg_image)
    : defaultTeamLogo;
  const leagueName = item?.league?.name || "NCAA Program";
  const sportName = item?.league?.sport || "Collegiate Sports";
  const userBalance = Number(data?.userData?.totalAmount || 0);

  return (
    <>
      {/* Trigger Button or Render Prop */}
      {typeof children === "function" ? (
        children({ openTip, openDetails })
      ) : children ? (
        children
      ) : (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openTip}
            className={
              className ||
              "bg-[#053697] hover:bg-[#042873] text-white font-bold py-2 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
            }
          >
            {buttonText || "Send Tippz"}
          </button>
        </div>
      )}

      {/* ─── MODAL 1: SELECT TIP AMOUNT (Pure Tailwind, NO antd) ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={handleCancel}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            {/* Top Close Button */}
            <button
              type="button"
              onClick={handleCancel}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Team Header Ribbon */}
            <div className="relative bg-gradient-to-r from-[#053697] via-[#0845bc] to-[#053697] text-white pt-7 pb-10 px-6 text-center">
              <div className="absolute inset-0 bg-white/5 pointer-events-none" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#2FC191] block mb-1">
                DIRECT NIL TEAM PROGRAM TIP
              </span>
              <h3 className="text-xl font-black uppercase tracking-tight text-white truncate px-6">
                {item?.name || "Official Team"}
              </h3>
              <p className="text-xs text-blue-200 mt-0.5 truncate">
                {leagueName} • {sportName}
              </p>
            </div>

            {/* Overlapping Team Logo */}
            <div className="relative flex justify-center -mt-9 mb-2 z-10">
              <div className="relative w-18 h-18 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white p-1">
                <Image
                  src={teamLogoSrc}
                  alt={item?.name || "Team"}
                  fill
                  sizes="72px"
                  className="object-contain p-1"
                />
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleProceedToPayment} className="p-6 pt-2 space-y-5">
              {/* Preset Amounts Grid */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2.5">
                  Select Tip Amount
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {PRESET_AMOUNTS.map((val) => {
                    const isSelected = selectedPreset === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handlePresetSelect(val)}
                        className={`h-11 rounded-xl text-sm font-black transition-all cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? "bg-[#053697] text-white shadow-md scale-[1.02] ring-2 ring-[#053697]/20"
                            : "bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800"
                        }`}
                      >
                        ${val}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Amount Input */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                  Or Enter Custom Amount
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base pointer-events-none">
                    $
                  </div>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Other amount (e.g. 50)"
                    className="w-full h-11 pl-8 pr-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:border-[#053697] focus:ring-2 focus:ring-[#053697]/15 outline-none text-slate-900 font-bold text-sm transition-all"
                  />
                </div>
              </div>

              {/* Compliance & Impact Note */}
              <div className="p-3 bg-blue-50/60 border border-blue-100/80 rounded-xl flex items-start gap-2.5 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-[#053697] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  100% of tips directly support athletic program travel, training facilities, and student-athletes.
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={!Number(amount) || Number(amount) <= 0}
                className="w-full h-12 rounded-xl bg-[#2FC191] hover:bg-[#28b887] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-[#053697] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow cursor-pointer"
              >
                <span>Continue to Payment (${amount || "0"})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: SELECT PAYMENT METHOD (Pure Tailwind, NO antd) ─── */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={handleCancel}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#053697] block">
                  STEP 2 OF 2
                </span>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Choose Payment Method
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCancel}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tip Summary Bar */}
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                Tipping {item?.name}
              </span>
              <span className="text-sm font-black text-[#053697]">
                ${Number(amount).toFixed(2)}
              </span>
            </div>

            {/* Payment Options */}
            <div className="p-6 space-y-3">
              {/* Option 1: Profile Balance */}
              <div
                onClick={() => setPaymentMethod("deposit")}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                  paymentMethod === "deposit"
                    ? "border-[#053697] bg-blue-50/30 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    paymentMethod === "deposit"
                      ? "bg-[#053697] text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">
                      ProTippz Wallet Balance
                    </h4>
                    {paymentMethod === "deposit" && (
                      <Check className="w-4 h-4 text-[#053697]" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Instant deduction from your account funds.
                  </p>
                  <div className="mt-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 inline-block px-2 py-0.5 rounded-md border border-emerald-200/60">
                    Available: ${userBalance.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Option 2: Credit Card / Paypal */}
              <div
                onClick={() => setPaymentMethod("credit")}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                  paymentMethod === "credit"
                    ? "border-[#053697] bg-blue-50/30 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    paymentMethod === "credit"
                      ? "bg-[#053697] text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">
                      Credit / Debit Card or PayPal
                    </h4>
                    {paymentMethod === "credit" && (
                      <Check className="w-4 h-4 text-[#053697]" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Direct checkout powered by Stripe.
                  </p>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                    Visa • Mastercard • Amex • PayPal
                  </span>
                </div>
              </div>

              {/* Actions Button Group */}
              <div className="pt-3 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsPaymentModalOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="h-11 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handlePaymentSubmit}
                  disabled={isSubmitting}
                  className="flex-1 h-11 rounded-xl bg-[#053697] hover:bg-[#042873] active:scale-[0.99] disabled:opacity-60 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete ${Number(amount).toFixed(2)} Tip</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: INSUFFICIENT FUNDS MODAL (Pure Tailwind, NO antd) ─── */}
      {isOopsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={handleCancel}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-sm bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden p-6 text-center z-10 animate-in zoom-in-95 duration-200">
            {/* Warning Icon Container */}
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 border border-amber-200/80 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Insufficient Wallet Funds
            </h3>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              You don&apos;t have enough balance in your deposit wallet to complete this{" "}
              <strong className="text-slate-900">${Number(amount).toFixed(2)}</strong> tip.
              Your available balance is{" "}
              <strong className="text-emerald-600">${userBalance.toFixed(2)}</strong>.
            </p>

            <div className="mt-6 space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  handleCancel();
                  router.push("/deposit");
                }}
                className="w-full h-11 rounded-xl bg-[#053697] hover:bg-[#042873] text-white font-black text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Deposit Funds to Wallet</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleCancel();
                  router.push(
                    `/send-tip?amount=${amount}&entityType=Team&entityId=${item?._id}`
                  );
                }}
                className="w-full h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Pay with Card Instead</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(SendTipsButton);
