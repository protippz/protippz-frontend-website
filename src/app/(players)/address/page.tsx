"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Building2,
  Landmark,
  Hash,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { patch } from "@/ApisRequests/server";
import { useContextData } from "@/provider/ContextProvider";

interface AddressFormData {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

const AddressPage = () => {
  const router = useRouter();
  const context = useContextData();
  const player = context?.userData;

  const [formData, setFormData] = useState<AddressFormData>({
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Pre-fill existing address data
  useEffect(() => {
    if (player?.address) {
      setFormData({
        streetAddress: player.address.streetAddress || "",
        city: player.address.city || "",
        state: player.address.state || "",
        zipCode: player.address.zipCode ? String(player.address.zipCode) : "",
      });
      setInitialLoading(false);
    } else if (player) {
      setInitialLoading(false);
    }
  }, [player]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedStreet = formData.streetAddress.trim();
    const trimmedCity = formData.city.trim();
    const trimmedState = formData.state.trim();
    const trimmedZip = formData.zipCode.trim();

    if (!trimmedStreet) {
      toast.error("Please enter your street address");
      return;
    }
    if (!trimmedCity) {
      toast.error("Please enter your city");
      return;
    }
    if (!trimmedState) {
      toast.error("Please enter your state");
      return;
    }
    if (!trimmedZip) {
      toast.error("Please enter your zip code");
      return;
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Please sign in to update your address");
      router.push("/sign-in");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        streetAddress: trimmedStreet,
        city: trimmedCity,
        state: trimmedState,
        zipCode: trimmedZip,
      };

      const res = await patch(
        `/player/edit-address-tax`,
        { address: payload },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setLoading(false);

      if (res?.success) {
        toast.success(res?.message || "Address updated successfully!");
        setTimeout(() => {
          router.push("/home");
        }, 800);
      } else {
        if (res?.success === false && res?.message?.toLowerCase().includes("token")) {
          toast.error("Session expired. Please sign in again.");
          Cookies.remove("token");
          localStorage.removeItem("token");
          setTimeout(() => {
            router.push("/sign-in");
          }, 1200);
        } else {
          toast.error(res?.message || "Failed to update address. Please try again.");
        }
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Top Header / Breadcrumb Card: Apple Toolbar Aesthetic */}
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-md p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ">
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
            Athlete Account Settings
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#053697] text-[11px] font-bold uppercase tracking-wider font-mono self-end sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-[#053697]" />
          <span>Official Record</span>
        </div>
      </div>

      {/* Main Address Card with Continuous Squircle Curvature */}
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-md p-6 sm:p-8 md:p-10  relative overflow-hidden">
        {/* Subtle decorative gradient glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-blue-50/70 via-emerald-50/40 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 space-y-6">
          {/* Card Header */}
          <div className="text-left space-y-2 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-md bg-[#053697]/10 flex items-center justify-center text-[#053697] shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Mailing & Residential Address
                </h1>
                <p className="text-xs sm:text-[13px] text-slate-500 mt-0.5">
                  Your primary address for official NIL documentation, tax reporting (1099), and correspondence.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Street Address */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="streetAddress"
                className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider"
              >
                Street Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400 pointer-events-none">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  id="streetAddress"
                  name="streetAddress"
                  type="text"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  placeholder="e.g. 123 Championship Way, Apt 4B"
                  className="w-full h-12 pl-11 pr-4 rounded-md border border-slate-200 bg-slate-50/70 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#053697] focus:bg-white transition-all "
                />
              </div>
            </div>

            {/* City, State, Zip Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
              {/* City */}
              <div className="space-y-1.5 sm:col-span-1">
                <label
                  htmlFor="city"
                  className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider"
                >
                  City <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-400 pointer-events-none">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Austin"
                    className="w-full h-12 pl-11 pr-4 rounded-md border border-slate-200 bg-slate-50/70 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#053697] focus:bg-white transition-all "
                  />
                </div>
              </div>

              {/* State */}
              <div className="space-y-1.5 sm:col-span-1">
                <label
                  htmlFor="state"
                  className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider"
                >
                  State <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-400 pointer-events-none">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. TX"
                    className="w-full h-12 pl-11 pr-4 rounded-md border border-slate-200 bg-slate-50/70 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#053697] focus:bg-white transition-all "
                  />
                </div>
              </div>

              {/* Zip Code */}
              <div className="space-y-1.5 sm:col-span-1">
                <label
                  htmlFor="zipCode"
                  className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider"
                >
                  Zip Code <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-400 pointer-events-none">
                    <Hash className="w-4 h-4" />
                  </div>
                  <input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="e.g. 78712"
                    className="w-full h-12 pl-11 pr-4 rounded-md border border-slate-200 bg-slate-50/70 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#053697] focus:bg-white transition-all "
                  />
                </div>
              </div>
            </div>

            {/* Privacy & Compliance Info Pill */}
            <div className="p-4 bg-slate-50 rounded-md border border-slate-100 flex items-start gap-2 text-left">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1f8763] flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-[#2FC191]" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">
                  Secure & NCAA/NIL Tax Compliant
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Your address details are encrypted and never shown on your public athlete profile. They are strictly utilized for IRS Form 1099 preparation and identity verification.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
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
                    <span>Save Address</span>
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

export default AddressPage;
