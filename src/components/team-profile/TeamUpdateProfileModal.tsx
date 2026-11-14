"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Camera,
  Loader2,
  Trophy,
  Mail,
  Shield,
  Search,
  Check,
  ChevronDown,
  Save,
} from "lucide-react";
import { FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa6";
import toast from "react-hot-toast";
import { get, patch, imageUrl } from "@/ApisRequests/server";
import LinkedInImageCropModal from "@/components/UpdateProfile/client/LinkedInImageCropModal";
import ptLogo from "@/Assets/PT Logo.png";

interface LeagueItem {
  _id: string;
  name: string;
  league_image?: string;
  sport?: string;
}

interface TeamUpdateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: any;
  onSuccess?: () => void;
  onEmailChange?: (newEmail: string) => void;
}

export const TeamUpdateProfileModal: React.FC<TeamUpdateProfileModalProps> = ({
  isOpen,
  onClose,
  team,
  onSuccess,
  onEmailChange,
}) => {
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [selectedLeagueId, setSelectedLeagueId] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [tiktok, setTiktok] = useState("");

  // League selector state
  const [leagues, setLeagues] = useState<LeagueItem[]>([]);
  const [loadingLeagues, setLoadingLeagues] = useState(false);
  const [leagueSearch, setLeagueSearch] = useState("");
  const [isLeagueDropdownOpen, setIsLeagueDropdownOpen] = useState(false);
  const leagueDropdownRef = useRef<HTMLDivElement>(null);

  // Logo cropping state
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [rawImageFile, setRawImageFile] = useState<File | null>(null);
  const [croppedImageFile, setCroppedImageFile] = useState<File | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form when team prop changes or modal opens
  useEffect(() => {
    if (team && isOpen) {
      setName(team.name || "");
      setEmail(team.email || team.user?.email || "");
      setDescription(team.description || "");
      setInstagram(team.instagram || "");
      setTwitter(team.twitter || "");
      setTiktok(team.tiktok || "");

      const tLeagueId =
        typeof team.league === "object" ? team.league?._id : team.league || "";
      setSelectedLeagueId(tLeagueId);

      setPreviewUrl(team.team_logo ? imageUrl(team.team_logo) : ptLogo.src);
      setCroppedImageFile(null);
      setRawImageFile(null);
    }
  }, [team, isOpen]);

  // Load leagues list for league selector
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    const fetchLeagues = async () => {
      setLoadingLeagues(true);
      try {
        const res = await get("/league/get-all?limit=100&page=1");
        if (isMounted && res?.data?.result) {
          setLeagues(res.data.result);
        }
      } catch (err) {
        console.error("Failed to load leagues:", err);
      } finally {
        if (isMounted) setLoadingLeagues(false);
      }
    };

    fetchLeagues();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        leagueDropdownRef.current &&
        !leagueDropdownRef.current.contains(e.target as Node)
      ) {
        setIsLeagueDropdownOpen(false);
      }
    };

    if (isLeagueDropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isLeagueDropdownOpen]);

  // File selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image file size cannot exceed 10MB");
        return;
      }
      setRawImageFile(file);
      setIsCropModalOpen(true);
      e.target.value = "";
    }
  };

  const handleCropSave = (croppedFile: File, croppedPreviewUrl: string) => {
    setCroppedImageFile(croppedFile);
    setPreviewUrl(croppedPreviewUrl);
    setIsCropModalOpen(false);
    toast.success("Team logo adjusted! Click 'Save Changes' to update profile.");
  };

  // Selected league object
  const currentSelectedLeague = leagues.find(
    (l) => l._id === selectedLeagueId
  ) || (
    typeof team?.league === "object" && team?.league?.name
      ? (team.league as LeagueItem)
      : null
  );

  const filteredLeagues = leagues.filter((l) =>
    l.name.toLowerCase().includes(leagueSearch.toLowerCase().trim())
  );

  const handleSelectLeague = (l: LeagueItem) => {
    setSelectedLeagueId(l._id);
    setIsLeagueDropdownOpen(false);
    setLeagueSearch("");
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Team name is required");
      return;
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        toast.error("Please enter a valid email address");
        return;
      }
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Please sign in to update team profile");
      return;
    }

    // Build partial dirty fields payload according to PROFILE_API_FRONTEND.md
    const dirtyFields: Record<string, string> = {};

    const initialName = (team?.name || "").trim();
    if (name.trim() !== initialName) dirtyFields.name = name.trim();

    const initialDesc = (team?.description || "").trim();
    if (description.trim() !== initialDesc)
      dirtyFields.description = description.trim();

    const initialEmail = (team?.email || team?.user?.email || "")
      .trim()
      .toLowerCase();
    const newEmail = email.trim().toLowerCase();
    const isEmailChanged = newEmail !== "" && newEmail !== initialEmail;
    if (isEmailChanged) dirtyFields.email = email.trim();

    const initialLeagueId =
      typeof team?.league === "object" ? team?.league?._id : team?.league;
    if (selectedLeagueId && selectedLeagueId !== initialLeagueId) {
      dirtyFields.league = selectedLeagueId;
    }

    const cleanIg = instagram.trim().replace(/^@/, "");
    const initialIg = (team?.instagram || "").trim().replace(/^@/, "");
    if (cleanIg !== initialIg) dirtyFields.instagram = cleanIg;

    const cleanTwitter = twitter.trim().replace(/^@/, "");
    const initialTwitter = (team?.twitter || "").trim().replace(/^@/, "");
    if (cleanTwitter !== initialTwitter) dirtyFields.twitter = cleanTwitter;

    const cleanTiktok = tiktok.trim().replace(/^@/, "");
    const initialTiktok = (team?.tiktok || "").trim().replace(/^@/, "");
    if (cleanTiktok !== initialTiktok) dirtyFields.tiktok = cleanTiktok;

    const hasLogoChange = Boolean(croppedImageFile);
    const hasFieldChanges = Object.keys(dirtyFields).length > 0;

    if (!hasLogoChange && !hasFieldChanges) {
      toast("No profile changes detected");
      onClose();
      return;
    }

    setIsSaving(true);
    try {
      let res: any;

      if (hasLogoChange) {
        const formData = new FormData();
        if (hasFieldChanges) {
          formData.append("data", JSON.stringify(dirtyFields));
        }
        formData.append("team_logo", croppedImageFile as File);

        res = await patch("/team/profile", formData, {
          headers: {
            Authorization: `${token}`,
          },
        });
      } else {
        res = await patch("/team/profile", dirtyFields, {
          headers: {
            Authorization: `${token}`,
          },
        });
      }

      setIsSaving(false);

      if (res?.success) {
        toast.success(res?.message || "Team profile updated successfully!");
        onClose();

        if (isEmailChanged && onEmailChange) {
          toast.success(
            "A verification code has been sent to your new email address."
          );
          onEmailChange(email.trim());
        } else if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(
          res?.message ||
            res?.errorDetails?.message ||
            "Failed to update team profile"
        );
      }
    } catch (err: any) {
      setIsSaving(false);
      console.error("Team profile update error:", err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "An error occurred while updating team profile"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md overflow-y-auto">
      {/* Modal Dialog Card with Continuous Apple Squircles */}
      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-[28px] sm:rounded-[32px] border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Header Bar */}
        <div className="px-5 sm:px-7 py-4.5 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#053697]/10 text-[#053697] flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Edit Team Profile
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Update your franchise branding, league affiliation, and public details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-xs sm:text-sm"
        >
          {/* Section 1: Logo & Franchise Branding */}
          <div className="p-4 sm:p-5 rounded-[22px] bg-slate-50/70 border border-slate-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
              {/* Logo Preview with Camera Overlay */}
              <div className="relative group shrink-0">
                <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-[22px] ring-4 ring-white border border-slate-200/90 overflow-hidden bg-slate-100 flex items-center justify-center">
                  <Image
                    src={previewUrl || ptLogo.src}
                    alt="Team Logo Preview"
                    fill
                    sizes="96px"
                    className="object-contain p-2"
                    onError={() => setPreviewUrl(ptLogo.src)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-[#053697] hover:bg-[#042870] active:scale-[0.98] text-white rounded-full border-2 border-white transition-all cursor-pointer"
                  title="Upload New Logo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Upload instructions */}
              <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900">
                  Official Team Crest / Logo
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Upload your high-res franchise emblem. Supports PNG, JPG, or
                  WebP up to 10MB. You can crop, rotate, and adjust before saving.
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-[#053697] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Choose Logo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Inputs: Team Name & Contact Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                  <span>Team / Franchise Name</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Kansas City Chiefs"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#053697] focus:ring-1 focus:ring-[#053697] outline-none text-slate-900 font-bold text-xs sm:text-sm transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
                  <span>Contact Email</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Requires OTP on change
                  </span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. team@franchise.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#053697] focus:ring-1 focus:ring-[#053697] outline-none text-slate-900 font-medium text-xs sm:text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Team Statement / Description */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
                <span>Team Statement / About</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {description.length}/500
                </span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                rows={3}
                placeholder="Share your team history, achievements, mission statement, or a message to your fans..."
                className="w-full p-3 rounded-xl bg-white border border-slate-200 focus:border-[#053697] focus:ring-1 focus:ring-[#053697] outline-none text-slate-900 font-medium text-xs sm:text-sm transition-all resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Section 2: League Affiliation */}
          <div className="p-4 sm:p-5 rounded-[22px] bg-slate-50/70 border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-200/60">
              <Trophy className="w-4 h-4 text-[#053697]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Official League Affiliation
              </h3>
            </div>

            <div className="space-y-1.5" ref={leagueDropdownRef}>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
                <span>Selected League</span>
                <span className="text-[10px] text-slate-400">
                  Derives sport category automatically
                </span>
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsLeagueDropdownOpen((prev) => !prev)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-left flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-200/80 overflow-hidden flex items-center justify-center shrink-0">
                      {currentSelectedLeague?.league_image ? (
                        <Image
                          src={imageUrl(currentSelectedLeague.league_image)}
                          alt={currentSelectedLeague.name}
                          width={24}
                          height={24}
                          className="object-contain"
                          onError={(e) => {
                            (e.currentTarget as any).src = ptLogo.src;
                          }}
                        />
                      ) : (
                        <Shield className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                      {currentSelectedLeague?.name || "Select an official league"}
                    </span>
                    {currentSelectedLeague?.sport && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600 uppercase font-mono hidden sm:inline-block">
                        {currentSelectedLeague.sport}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isLeagueDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isLeagueDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl z-30 overflow-hidden max-h-60 flex flex-col">
                    <div className="p-2 border-b border-slate-100 bg-slate-50/80">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={leagueSearch}
                          onChange={(e) => setLeagueSearch(e.target.value)}
                          placeholder="Search leagues..."
                          className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#053697]"
                        />
                      </div>
                    </div>

                    <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
                      {loadingLeagues ? (
                        <div className="p-4 text-center text-slate-400 flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-[#053697]" />
                          <span>Loading leagues...</span>
                        </div>
                      ) : filteredLeagues.length === 0 ? (
                        <div className="p-4 text-center text-slate-400 text-xs">
                          No matching leagues found
                        </div>
                      ) : (
                        filteredLeagues.map((l) => {
                          const isSelected = l._id === selectedLeagueId;
                          return (
                            <button
                              key={l._id}
                              type="button"
                              onClick={() => handleSelectLeague(l)}
                              className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between transition-colors cursor-pointer ${
                                isSelected
                                  ? "bg-[#053697]/10 text-[#053697]"
                                  : "hover:bg-slate-50 text-slate-800"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200/70 overflow-hidden flex items-center justify-center shrink-0">
                                  {l.league_image ? (
                                    <Image
                                      src={imageUrl(l.league_image)}
                                      alt={l.name}
                                      width={24}
                                      height={24}
                                      className="object-contain"
                                    />
                                  ) : (
                                    <Shield className="w-3 h-3 text-slate-400" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-xs truncate">
                                    {l.name}
                                  </div>
                                  {l.sport && (
                                    <div className="text-[10px] text-slate-400 font-mono truncate">
                                      {l.sport}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {isSelected && (
                                <Check className="w-4 h-4 text-[#053697] shrink-0" />
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Social Media Accounts */}
          <div className="p-4 sm:p-5 rounded-[22px] bg-slate-50/70 border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-200/60">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                Franchise Social Media
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <FaInstagram className="w-3.5 h-3.5 text-rose-600" />
                  <span>Instagram</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
                    @
                  </span>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) =>
                      setInstagram(e.target.value.replace(/^@/, ""))
                    }
                    placeholder="handle"
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#053697] focus:ring-1 focus:ring-[#053697] outline-none text-slate-900 font-mono text-xs sm:text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <FaTwitter className="w-3.5 h-3.5 text-slate-900" />
                  <span>X / Twitter</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
                    @
                  </span>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) =>
                      setTwitter(e.target.value.replace(/^@/, ""))
                    }
                    placeholder="handle"
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#053697] focus:ring-1 focus:ring-[#053697] outline-none text-slate-900 font-mono text-xs sm:text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <FaTiktok className="w-3.5 h-3.5 text-slate-900" />
                  <span>TikTok</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
                    @
                  </span>
                  <input
                    type="text"
                    value={tiktok}
                    onChange={(e) =>
                      setTiktok(e.target.value.replace(/^@/, ""))
                    }
                    placeholder="handle"
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#053697] focus:ring-1 focus:ring-[#053697] outline-none text-slate-900 font-mono text-xs sm:text-sm transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-5 sm:px-7 py-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider active:scale-[0.98] transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-[#053697] hover:bg-[#042870] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Linked Crop & Image Filter Modal */}
      {isCropModalOpen && rawImageFile && (
        <LinkedInImageCropModal
          isOpen={isCropModalOpen}
          file={rawImageFile}
          onClose={() => setIsCropModalOpen(false)}
          onSave={handleCropSave}
        />
      )}
    </div>
  );
};

