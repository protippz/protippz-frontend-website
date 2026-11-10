"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  User,
  Hash,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Lock,
  Globe2,
  Building,
} from "lucide-react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { patch } from "@/ApisRequests/server";
import { useContextData } from "@/provider/ContextProvider";

interface TaxInfoFormData {
  fullname: string;
  taxId: string;
  address: string;
  residentialStatus: "Resident" | "Non Resident";
}

const TaxInformationPage = () => {
  const router = useRouter();
  const context = useContextData();
  const player = context?.userData;

  const [formData, setFormData] = useState<TaxInfoFormData>({
    fullname: "",
    taxId: "",
    address: "",
    residentialStatus: "Resident",
  });

  const [loading, setLoading] = useState(false);
  const [showTaxId, setShowTaxId] = useState(false);

  // Pre-fill existing tax information
  useEffect(() => {
    if (player?.taxInfo) {
      setFormData({
        fullname: player.taxInfo.fullname || player.name || "",
        taxId: player.taxInfo.taxId || "",
        address:
          player.taxInfo.address ||
          (player.address
            ? [
              player.address.streetAddress,
              player.address.city,
              player.address.state,
              player.address.zipCode,
            ]
              .filter(Boolean)
              .join(", ")
            : ""),
        residentialStatus:
          player.taxInfo.residentialStatus === "Non Resident"
            ? "Non Resident"
            : "Resident",
      });
    } else if (player) {
      // Default initial fallbacks from profile if taxInfo not yet set
      setFormData((prev) => ({
        ...prev,
        fullname: player.name || "",
        address: player.address
          ? [
            player.address.streetAddress,
            player.address.city,
            player.address.state,
            player.address.zipCode,
          ]
            .filter(Boolean)
            .join(", ")
          : "",
      }));
    }
  }, [player]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusSelect = (status: "Resident" | "Non Resident") => {
    setFormData((prev) => ({
      ...prev,
      residentialStatus: status,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = formData.fullname.trim();
    const trimmedTaxId = formData.taxId.trim();
    const trimmedAddress = formData.address.trim();

    if (!trimmedName) {
      toast.error("Please enter your full legal name");
      return;
    }
    if (!trimmedTaxId) {
      toast.error("Please enter your Tax ID (SSN or EIN)");
      return;
    }
    if (!trimmedAddress) {
      toast.error("Please enter your permanent tax address");
      return;
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Please sign in to update your tax information");
      router.push("/sign-in");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullname: trimmedName,
        taxId: trimmedTaxId,
        address: trimmedAddress,
        residentialStatus: formData.residentialStatus,
      };

      const res = await patch(
        `/player/edit-address-tax`,
        { taxInfo: payload },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setLoading(false);

      if (res?.success) {
        toast.success(res?.message || "Tax information saved successfully!");
        setTimeout(() => {
          router.push("/home");
        }, 800);
      } else {
        if (
          res?.success === false &&
          res?.message?.toLowerCase().includes("token")
        ) {
          toast.error("Session expired. Please sign in again.");
          Cookies.remove("token");
          localStorage.removeItem("token");
          setTimeout(() => {
            router.push("/sign-in");
          }, 1200);
        } else {
          toast.error(
            res?.message || "Failed to update tax information. Please try again."
          );
        }
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(
        err?.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Top Header / Breadcrumb Card: Apple Toolbar Aesthetic */}
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-[24px] sm:rounded-[28px] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ">
        <div className="flex items-center gap-2">
          <Link
            href="/home"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>Back to Portal</span>
          </Link>
          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-300" />
          <span className="text-xs font-semibold text-slate-500">
            Athlete Tax Compliance
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#053697] text-[11px] font-bold uppercase tracking-wider font-mono self-end sm:self-auto">
          <Lock className="w-3.5 h-3.5 text-[#053697]" />
          <span>Form W-9 / 1099</span>
        </div>
      </div>

      {/* Main Content Card with Continuous Squircle Curvature */}
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 md:p-10  relative overflow-hidden">
        {/* Decorative soft gradient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-50/70 via-indigo-50/40 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 space-y-6">
          {/* Card Header */}
          <div className="text-left space-y-2 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-[#053697]/10 flex items-center justify-center text-[#053697] shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Taxpayer Identification
                </h1>
                <p className="text-xs sm:text-[13px] text-slate-500 mt-0.5">
                  Official W-9 details required for annual 1099 tax reporting and NIL payout distributions.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Legal Name */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="fullname"
                className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider"
              >
                Full Legal Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400 pointer-events-none">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="As shown on your official tax return"
                  className="w-full h-12 pl-11 pr-4 rounded-2xl border border-slate-200 bg-slate-50/70 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#053697] focus:bg-white transition-all "
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Name must match the records on file with the Social Security Administration or IRS.
              </p>
            </div>

            {/* Tax ID (SSN / EIN) */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="taxId"
                  className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider"
                >
                  Taxpayer ID Number (SSN or EIN) <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowTaxId(!showTaxId)}
                  className="text-[11px] font-bold text-[#053697] hover:underline cursor-pointer"
                >
                  {showTaxId ? "Hide" : "Show"}
                </button>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400 pointer-events-none">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  id="taxId"
                  name="taxId"
                  type={showTaxId ? "text" : "password"}
                  value={formData.taxId}
                  onChange={handleChange}
                  placeholder="XXX-XX-XXXX or XX-XXXXXXX"
                  className="w-full h-12 pl-11 pr-4 rounded-2xl border border-slate-200 bg-slate-50/70 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#053697] focus:bg-white transition-all "
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="address"
                className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider"
              >
                Permanent Tax Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400 pointer-events-none">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street, City, State, ZIP code"
                  className="w-full h-12 pl-11 pr-4 rounded-2xl border border-slate-200 bg-slate-50/70 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#053697] focus:bg-white transition-all "
                />
              </div>
            </div>

            {/* Residential Status Segmented Picker */}
            <div className="space-y-2 text-left pt-1">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Residential Status for Tax Purposes <span className="text-rose-500">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Resident Option */}
                <button
                  type="button"
                  onClick={() => handleStatusSelect("Resident")}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2 ${formData.residentialStatus === "Resident"
                    ? "bg-blue-50/70 border-[#053697] ring-1 ring-[#053697]"
                    : "bg-slate-50/80 border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-[#053697]" />
                      <span className="text-xs font-bold text-slate-900">
                        U.S. Resident / Citizen
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      U.S. Citizen, Resident Alien, or domestic business entity (Form W-9).
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${formData.residentialStatus === "Resident"
                      ? "border-[#053697] bg-[#053697] text-white"
                      : "border-slate-300 bg-white"
                      }`}
                  >
                    {formData.residentialStatus === "Resident" && (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>

                {/* Non Resident Option */}
                <button
                  type="button"
                  onClick={() => handleStatusSelect("Non Resident")}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2 ${formData.residentialStatus === "Non Resident"
                    ? "bg-blue-50/70 border-[#053697] ring-1 ring-[#053697]"
                    : "bg-slate-50/80 border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Globe2 className="w-4 h-4 text-[#053697]" />
                      <span className="text-xs font-bold text-slate-900">
                        Non-Resident Alien
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      International student-athlete or foreign tax resident (Form W-8BEN).
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${formData.residentialStatus === "Non Resident"
                      ? "border-[#053697] bg-[#053697] text-white"
                      : "border-slate-300 bg-white"
                      }`}
                  >
                    {formData.residentialStatus === "Non Resident" && (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Privacy & Security Callout */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2 text-left">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1f8763] flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-[#2FC191]" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">
                  Bank-Grade Encryption & Privacy
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Your Tax ID and personal legal records are encrypted with 256-bit security. They will never appear on your public athlete profile and are solely used for NCAA compliance and IRS 1099 distribution.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2">
              <Link
                href="/home"
                className="w-full sm:w-auto px-6 h-11 sm:h-12 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-all cursor-pointer"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 h-11 sm:h-12 rounded-full bg-[#053697] hover:bg-[#042870] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Tax Information</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaxInformationPage;
