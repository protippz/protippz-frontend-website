"use client";

import React, { useState } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { post } from "@/ApisRequests/server";
import { useRouter } from "next/navigation";
import {
  Lock,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

const QUICK_AMOUNTS = [25, 50, 100, 250, 500];

// --- Crisp Vector Logos ---
const VisaLogo = () => (
  <svg viewBox="0 0 36 24" className="h-4 sm:h-5 w-auto rounded shrink-0" fill="none">
    <rect width="36" height="24" rx="3" fill="#0A2540" />
    <path
      d="M14.6 15.6l1.6-9.2h2.5l-1.6 9.2h-2.5zm8.9-9c-.5-.2-1.3-.4-2.3-.4-2.5 0-4.3 1.3-4.3 3.1 0 1.4 1.3 2.1 2.3 2.6 1 .5 1.3.8 1.3 1.2 0 .7-.8 1-1.6 1-.9 0-1.4-.1-2.2-.5l-.3-.2-.3 1.8c.6.3 1.6.5 2.6.5 2.7 0 4.4-1.3 4.4-3.2 0-1.1-.7-1.9-2.2-2.6-.9-.5-1.5-.8-1.5-1.2 0-.4.5-.9 1.5-.9.8 0 1.4.2 1.9.4l.2.1.3-1.7zm5.5 0h-2c-.6 0-1.1.2-1.3.8l-3.7 8.4h2.7l.5-1.5h3.3l.3 1.5h2.4l-2.2-9.2zm-2.4 6l1-2.9.6 2.9h-1.6zm-17.7-6l-2.4 6.3-.3-1.3c-.5-1.6-2-3.3-3.7-4.2l2.4 8.4h2.7l4-9.2h-2.7z"
      fill="#FFFFFF"
    />
  </svg>
);

const MastercardLogo = () => (
  <svg viewBox="0 0 36 24" className="h-4 sm:h-5 w-auto rounded shrink-0" fill="none">
    <rect width="36" height="24" rx="3" fill="#1E293B" />
    <circle cx="14" cy="12" r="6" fill="#EB001B" fillOpacity="0.9" />
    <circle cx="22" cy="12" r="6" fill="#F79E1B" fillOpacity="0.9" />
    <path
      d="M18 7.8a5.95 5.95 0 0 0-2.2 4.2c0 1.7.8 3.2 2.2 4.2a5.95 5.95 0 0 0 2.2-4.2c0-1.7-.8-3.2-2.2-4.2z"
      fill="#FF5F00"
    />
  </svg>
);

const AmexLogo = () => (
  <svg viewBox="0 0 36 24" className="h-4 sm:h-5 w-auto rounded shrink-0" fill="none">
    <rect width="36" height="24" rx="3" fill="#0077A6" />
    <text
      x="50%"
      y="55%"
      dominantBaseline="middle"
      textAnchor="middle"
      fill="#FFFFFF"
      fontSize="7.5"
      fontWeight="900"
      fontFamily="sans-serif"
      letterSpacing="0.5"
    >
      AMEX
    </text>
  </svg>
);

const PaypalLogo = () => (
  <svg viewBox="0 0 80 24" className="h-4 sm:h-5 w-auto shrink-0" fill="none">
    <path
      d="M8.5 3.5H3.2C2.8 3.5 2.5 3.8 2.4 4.2L0.3 17.5C0.2 17.8 0.5 18.1 0.8 18.1H3.6C4 18.1 4.3 17.8 4.4 17.4L5.1 13C5.2 12.6 5.5 12.3 5.9 12.3H7.5C11.1 12.3 13.3 10.5 13.9 7C14.2 4.8 12.9 3.5 8.5 3.5Z"
      fill="#003087"
    />
    <path
      d="M12.4 7.5C12.1 9.4 10.5 10.8 8.1 10.8H6.3L5.4 16.5C5.3 16.9 5.6 17.2 6 17.2H8.3C8.7 17.2 9 16.9 9.1 16.5L9.7 12.7C9.8 12.3 10.1 12 10.5 12H11.5C14.7 12 16.6 10.4 17.1 7.3C17.4 5.3 16.2 4.1 12.4 4.1H8.7C8.3 4.1 8 4.4 7.9 4.8L7.6 6.8L12.4 7.5Z"
      fill="#0079C1"
    />
    <text
      x="22"
      y="17"
      fill="#003087"
      fontSize="15"
      fontWeight="800"
      fontStyle="italic"
      fontFamily="sans-serif"
    >
      Pay<tspan fill="#0079C1">Pal</tspan>
    </text>
  </svg>
);

const DepositFundForm = () => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "paypal">("credit");
  const [amount, setAmount] = useState<string>("100");
  const [cardholderName, setCardholderName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const numericAmount = Number(amount) || 0;
  const formattedAmount =
    numericAmount > 0
      ? numericAmount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      return toast.error("Please enter a valid deposit amount.");
    }
    if (numericAmount > 999999) {
      return toast.error("Amount cannot exceed $999,999.");
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      return toast.error("Please log in to proceed.");
    }

    setIsProcessing(true);

    try {
      const clientSecret = await post(
        "/deposit/create-deposit-intent",
        {
          amount: numericAmount,
          paymentBy: paymentMethod === "credit" ? "Credit Card" : "Paypal",
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (!clientSecret?.success && !clientSecret?.data) {
        setIsProcessing(false);
        return toast.error(clientSecret?.message || "Failed to initialize payment.");
      }

      if (paymentMethod === "credit") {
        if (!stripe || !elements) {
          setIsProcessing(false);
          return toast.error("Payment processor initializing. Please retry.");
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          setIsProcessing(false);
          return toast.error("Card details element not found.");
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret?.data?.clientSecret,
          {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: cardholderName.trim() || "Account Holder",
              },
            },
          }
        );

        if (error) {
          console.error("Stripe payment error:", error);
          toast.error(error.message || "Payment confirmation failed.");
          setIsProcessing(false);
        } else {
          const executePayment = await post(
            "/deposit/execute-stripe-deposit",
            {
              transactionId: paymentIntent?.id,
            },
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );

          if (executePayment?.success) {
            toast.success(executePayment?.message || "Deposit successfully completed!");
            window.location.href = "/";
          } else {
            toast.error(executePayment?.message || "Unable to complete deposit.");
            setIsProcessing(false);
          }
        }
      } else if (paymentMethod === "paypal") {
        if (clientSecret?.data?.approvalUrl) {
          window.location.href = clientSecret.data.approvalUrl;
        } else {
          toast.error(clientSecret?.message || "Unable to retrieve PayPal checkout URL.");
          setIsProcessing(false);
        }
      }
    } catch (err: any) {
      console.error("Deposit error:", err);
      toast.error(err?.response?.data?.message || err?.message || "An error occurred.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center py-4 sm:py-8 px-3 sm:px-6">
      {/* Seamless Wall-to-Wall Divide X / Y Container */}
      <div className="w-full max-w-355 bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200"
        >
          {/* LEFT SECTION (Amount & Payment Method Selection, Wall-to-Wall Dividers) */}
          <div className="lg:col-span-5 flex flex-col justify-between divide-y divide-slate-200 bg-white">
            {/* Header */}
            <div className="px-6 sm:px-8 py-5">
              <span className="text-xs font-bold text-[#053697] uppercase tracking-wider">
                Wallet Funding
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
                Add funds
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Choose your amount and payment method
              </p>
            </div>

            {/* Content Body */}
            <div className="px-6 sm:px-8 py-6 space-y-6">
              {/* STEP 1: Amount */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="deposit-amount" className="text-xs sm:text-sm font-bold text-slate-800">
                    Deposit Amount
                  </label>
                  <span className="text-[11px] sm:text-xs text-slate-400 font-semibold">
                    USD ($)
                  </span>
                </div>

                <div className="relative flex items-center rounded-xl border border-slate-300 bg-white focus-within:border-[#053697] focus-within:ring-2 focus-within:ring-blue-100 transition-colors">
                  <span className="pl-4 pr-1 text-2xl sm:text-3xl font-bold text-slate-400 select-none">
                    $
                  </span>
                  <input
                    id="deposit-amount"
                    type="number"
                    step="any"
                    min="1"
                    max="999999"
                    placeholder="100.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full py-3.5 sm:py-4 pr-3 text-2xl sm:text-3xl font-bold text-slate-900 placeholder:text-slate-300 bg-transparent outline-none"
                    required
                  />
                  <span className="pr-4 text-xs font-bold text-slate-400 uppercase tracking-wider select-none">
                    USD
                  </span>
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {QUICK_AMOUNTS.map((val) => {
                    const isSelected = numericAmount === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(val.toString())}
                        className={`py-2 px-1 text-xs sm:text-sm font-semibold rounded-lg transition-colors border ${
                          isSelected
                            ? "bg-[#053697] text-white border-[#053697]"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        ${val}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: Payment Method */}
              <div className="space-y-2.5">
                <label className="block text-xs sm:text-sm font-bold text-slate-800">
                  Select Payment Method
                </label>

                {/* Credit Card Option */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setPaymentMethod("credit")}
                  onKeyDown={(e) => e.key === "Enter" && setPaymentMethod("credit")}
                  className={`cursor-pointer rounded-xl border p-3.5 sm:p-4 flex items-center justify-between transition-colors select-none ${
                    paymentMethod === "credit"
                      ? "border-2 border-[#053697] bg-blue-50/30"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        paymentMethod === "credit"
                          ? "border-[#053697] bg-[#053697]"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {paymentMethod === "credit" && (
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                        Credit / Debit Card
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Instant balance deposit
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 pl-2">
                    <VisaLogo />
                    <MastercardLogo />
                    <AmexLogo />
                  </div>
                </div>

                {/* PayPal Option */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setPaymentMethod("paypal")}
                  onKeyDown={(e) => e.key === "Enter" && setPaymentMethod("paypal")}
                  className={`cursor-pointer rounded-xl border p-3.5 sm:p-4 flex items-center justify-between transition-colors select-none ${
                    paymentMethod === "paypal"
                      ? "border-2 border-[#053697] bg-blue-50/30"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        paymentMethod === "paypal"
                          ? "border-[#053697] bg-[#053697]"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {paymentMethod === "paypal" && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                        PayPal
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Fast & secure checkout
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center pr-1 shrink-0 pl-2">
                    <PaypalLogo />
                  </div>
                </div>
              </div>
            </div>

            {/* Highlights Footer */}
            <div className="px-6 sm:px-8 py-4 flex items-center justify-between text-xs text-slate-600 bg-slate-50/50">
              <span>0% Deposit Fee</span>
              <span className="font-semibold text-[#053697]">Instant Crediting</span>
            </div>
          </div>

          {/* RIGHT SECTION (Payment Details & Final Action, Wall-to-Wall Dividers) */}
          <div className="lg:col-span-7 flex flex-col justify-between divide-y divide-slate-200 bg-slate-50/40">
            {/* Header */}
            <div className="px-6 sm:px-8 py-5 flex items-center justify-between bg-white">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {paymentMethod === "credit" ? "Payment Details" : "PayPal Review"}
              </span>
              <span className="text-xs font-bold text-[#053697]">
                Total: {formattedAmount ? `$${formattedAmount}` : "$0.00"}
              </span>
            </div>

            {/* Details Body */}
            <div className="px-6 sm:px-8 py-6 space-y-5">
              {paymentMethod === "credit" ? (
                <div className="space-y-4">
                  {/* Flat Clean Virtual Card Preview */}
                  <div className="rounded-xl bg-slate-900 p-4 sm:p-5 text-white border border-slate-800">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-5 sm:w-8 sm:h-6 rounded bg-amber-400 border border-amber-300 flex items-center justify-center">
                          <div className="w-4 h-3 sm:w-5 sm:h-4 border border-amber-900/30 rounded-xs opacity-60" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-mono font-semibold tracking-wider text-slate-400">
                          PROTIPPZ
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-xs font-mono font-semibold tracking-widest text-slate-400 uppercase">
                        SECURE
                      </span>
                    </div>

                    <div className="font-mono text-xs sm:text-sm tracking-widest text-slate-300 mb-3">
                      •••• •••• •••• ••••
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="min-w-0 mr-2">
                        <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          Cardholder
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-slate-100 tracking-wide truncate max-w-[180px] sm:max-w-[240px]">
                          {cardholderName.trim() || "YOUR NAME"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <VisaLogo />
                        <MastercardLogo />
                      </div>
                    </div>
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label
                      htmlFor="cardholder-name"
                      className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                    >
                      Cardholder Name
                    </label>
                    <input
                      id="cardholder-name"
                      type="text"
                      placeholder="e.g. John Doe"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      className="w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#053697] focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                      required={paymentMethod === "credit"}
                    />
                  </div>

                  {/* Stripe CardElement */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Card Details
                    </label>
                    <div className="h-11 sm:h-12 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-slate-300 bg-white focus-within:border-[#053697] focus-within:ring-2 focus-within:ring-blue-100 transition-colors flex items-center">
                      <div className="w-full">
                        <CardElement
                          options={{
                            style: {
                              base: {
                                fontSize: "15px",
                                color: "#0f172a",
                                fontFamily: "Inter, sans-serif",
                                "::placeholder": {
                                  color: "#94a3b8",
                                },
                              },
                              invalid: {
                                color: "#ef4444",
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 py-1">
                  <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#053697] font-bold text-sm">
                        <ShieldCheck className="w-5 h-5 text-[#053697]" />
                        <span>PayPal Express Checkout</span>
                      </div>
                      <PaypalLogo />
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      You will be securely redirected to PayPal to authorize your payment of{" "}
                      <span className="font-bold text-slate-900">
                        {formattedAmount ? `$${formattedAmount}` : "$0.00"}
                      </span>
                      . Funds will be credited to your account balance immediately.
                    </p>
                  </div>

                  {/* Order summary table */}
                  <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 text-xs">
                    <div className="p-3 flex justify-between text-slate-600">
                      <span>Deposit Amount</span>
                      <span className="font-semibold text-slate-900">{formattedAmount ? `$${formattedAmount}` : "$0.00"}</span>
                    </div>
                    <div className="p-3 flex justify-between text-slate-600">
                      <span>Processing Fee</span>
                      <span className="font-semibold text-[#2FC191]">Free ($0.00)</span>
                    </div>
                    <div className="p-3 flex justify-between bg-slate-50/60 font-bold text-slate-900 text-sm">
                      <span>Total Credited</span>
                      <span>{formattedAmount ? `$${formattedAmount}` : "$0.00"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button & Security Footer */}
            <div className="px-6 sm:px-8 py-5 space-y-3 bg-white">
              <button
                type="submit"
                disabled={isProcessing || !amount || numericAmount <= 0}
                className="w-full h-11 sm:h-12 bg-[#053697] hover:bg-[#053697]/90 active:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span>Processing deposit...</span>
                  </>
                ) : paymentMethod === "paypal" ? (
                  <span className="flex items-center gap-2">
                    Continue with PayPal
                    <ArrowRight className="w-4 h-4" />
                  </span>
                ) : (
                  <span>
                    Deposit {formattedAmount ? `$${formattedAmount}` : "$0.00"}
                  </span>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>256-bit SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2FC191] shrink-0" />
                  <span>PCI-DSS Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const DepositFundPage = () => {
  return (
    <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center py-4 sm:py-8">
      <Elements stripe={stripePromise}>
        <DepositFundForm />
      </Elements>
    </div>
  );
};

export default DepositFundPage;
