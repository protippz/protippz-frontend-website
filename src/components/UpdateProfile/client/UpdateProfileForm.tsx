"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextData } from "@/provider/ContextProvider";
import { imageUrl, patch } from "@/ApisRequests/server";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";
import {
  Camera,
  ArrowLeft,
  Loader2,
  Lock,
  MapPin,
  Check,
  BadgeCheck,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const UpdateProfileForm: React.FC = () => {
  const data = useContextData();
  const user = data?.userData;

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [options, setOptions] = useState<string[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setUsername(user.username || "");
      setPhone(user.phone || "");
      const userAddr =
        typeof user.address === "string"
          ? user.address
          : user.address?.streetAddress
          ? `${user.address.streetAddress}${
              user.address.city ? `, ${user.address.city}` : ""
            }${user.address.state ? `, ${user.address.state}` : ""}`
          : "";
      setAddress(userAddr || "");
    }
  }, [user]);

  // Handle outside click for address autocomplete dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchLocations = async (query: string): Promise<void> => {
    if (!query || query.trim().length < 2) {
      setOptions([]);
      return;
    }

    setLoadingPlaces(true);
    try {
      const response = await fetch(
        `/api/places?query=${encodeURIComponent(query)}`
      );
      const resData = await response.json();

      if (resData.predictions && Array.isArray(resData.predictions)) {
        setOptions(resData.predictions.map((item: any) => item.description));
        setShowOptions(true);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoadingPlaces(false);
    }
  };

  const debouncedFetch = useCallback(
    debounce(fetchLocations, 400) as (query: string) => Promise<void>,
    []
  );

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAddress(val);
    debouncedFetch(val);
  };

  const handleSelectAddress = (selected: string) => {
    setAddress(selected);
    setShowOptions(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error("Image size cannot exceed 5MB");
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      toast.success("New photo selected");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return toast.error("Please enter your full name");
    }

    const token =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("token")
        : null;
    if (!token) {
      return toast.error("Please log in to continue");
    }

    setIsSaving(true);
    try {
      const otherValues = {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(otherValues));
      if (selectedFile) {
        formData.append("profile_image", selectedFile);
      }

      const res = await patch("/normal-user/update-profile", formData, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (res?.success) {
        toast.success("Profile updated successfully!");
        window.location.href = "/profile";
      } else {
        toast.error(res?.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "An error occurred while updating profile"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const avatarSrc =
    previewUrl ||
    imageUrl(user?.profile_image || "") ||
    "https://i.ibb.co.com/f4tzYw2/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg";

  return (
    <div className="w-full max-w-355 mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Unified Container matching ProfilePage with Cover and Divide X/Y Grid */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200">
        
        {/* TOP SECTION: Cover Header & Identity Bar */}
        <div>
          {/* Cover Header */}
          <div className="h-28 sm:h-32 bg-gradient-to-r from-[#0d2e73] via-[#123F9C] to-[#1D4ED8] relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute left-8 top-0 w-32 h-32 rounded-full bg-[#2FC191]/15 blur-2xl pointer-events-none" />
          </div>

          {/* Profile Identity Row */}
          <div className="px-6 sm:px-8 pb-6 pt-0">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
              {/* Avatar with Camera Badge Overlay */}
              <div className="relative w-24 h-24 sm:w-26 sm:h-26 rounded-full border-4 border-white bg-slate-100 shrink-0 group">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={avatarSrc}
                    alt={user?.name || "Profile Avatar"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 96px, 104px"
                  />
                </div>
                {/* Camera Clickable Button */}
                <label
                  htmlFor="avatar-file-input"
                  className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#053697] hover:bg-[#053697]/90 text-white flex items-center justify-center cursor-pointer border-2 border-white transition-colors"
                  title="Change profile photo"
                >
                  <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </label>
                <input
                  id="avatar-file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Back to Profile CTA */}
              <div className="flex items-center">
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Profile</span>
                </Link>
              </div>
            </div>

            {/* User Title & Subtitle */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Edit Profile
                </h1>
                <BadgeCheck className="w-5 h-5 text-[#2FC191] shrink-0" />
              </div>
              <p className="text-sm font-medium text-slate-500 mt-0.5">
                Update your personal info, contact details, and mailing address
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Divide-X / Divide-Y Form & Side Options */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200"
        >
          {/* LEFT COLUMN: Form Inputs (8 of 12 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between divide-y divide-slate-200 bg-white">
            {/* Section Title */}
            <div className="px-6 sm:px-8 py-4 bg-white flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Personal Information
              </h2>
              <span className="text-[11px] font-semibold text-[#2FC191] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                SSL Encrypted
              </span>
            </div>

            {/* Input Fields */}
            <div className="px-6 sm:px-8 py-6 space-y-5">
              {/* Full Name & Phone Number Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="name-input"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                  >
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#053697] focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phone-input"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone-input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#053697] focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Email & Username Grid (Read-Only) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Address */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Email Address
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-500 cursor-not-allowed outline-none"
                  />
                </div>

                {/* Username */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Username
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  </div>
                  <input
                    type="text"
                    value={username ? `@${username}` : ""}
                    disabled
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-500 cursor-not-allowed outline-none font-medium"
                  />
                </div>
              </div>

              {/* Address with Live Autocomplete */}
              <div className="relative" ref={dropdownRef}>
                <label
                  htmlFor="address-input"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Mailing Address / Location
                </label>
                <div className="relative flex items-center">
                  <input
                    id="address-input"
                    type="text"
                    value={address}
                    onChange={handleAddressChange}
                    onFocus={() => {
                      if (options.length > 0) setShowOptions(true);
                    }}
                    placeholder="Start typing your street address..."
                    className="w-full h-11 pl-3.5 pr-10 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#053697] focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                  />
                  <div className="absolute right-3 text-slate-400 pointer-events-none">
                    {loadingPlaces ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#053697]" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                  </div>
                </div>

                {/* Autocomplete Dropdown */}
                {showOptions && options.length > 0 && (
                  <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-48 overflow-y-auto">
                    {options.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectAddress(opt)}
                        className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors"
                      >
                        <span className="truncate pr-2">{opt}</span>
                        {address === opt && (
                          <Check className="w-3.5 h-3.5 text-[#2FC191] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Submit Bar */}
            <div className="px-6 sm:px-8 py-4 bg-slate-50/50 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Ensure all fields are accurate before saving
              </span>
              <button
                type="submit"
                disabled={isSaving}
                className="h-11 px-8 bg-[#053697] hover:bg-[#053697]/90 active:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shrink-0"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Photo Guidelines & Navigation (4 of 12 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between divide-y divide-slate-200 bg-slate-50/40">
            {/* Header */}
            <div className="px-6 py-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Photo & Shortcuts
              </h3>
            </div>

            {/* Photo Guidelines */}
            <div className="p-6 space-y-3 bg-white">
              <p className="text-xs font-bold text-slate-900">
                Profile Photo Tips
              </p>
              <ul className="text-[11px] text-slate-500 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#2FC191] shrink-0 mt-0.5" />
                  <span>Use a clear, front-facing image</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#2FC191] shrink-0 mt-0.5" />
                  <span>Square aspect ratio recommended (1:1)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#2FC191] shrink-0 mt-0.5" />
                  <span>Maximum file size is 5MB (JPG, PNG, WEBP)</span>
                </li>
              </ul>
            </div>

            {/* Navigation Links */}
            <div className="divide-y divide-slate-100 bg-white">
              <Link
                href="/profile"
                className="group px-6 py-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-[#053697] transition-colors">
                    View Public Profile
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    See how your profile looks to others
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#053697] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>

              <Link
                href="/settings"
                className="group px-6 py-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-[#053697] transition-colors">
                    Account Settings
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Manage passwords & notifications
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#053697] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UpdateProfileForm;
