"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Camera,
  Loader2,
  User as UserIcon,
  Mail,
  GraduationCap,
  Clock,
  MapPin,
  Award,
  Hash,
  Shield,
  Search,
  Check,
  ChevronDown,
  AlertCircle,
  FileText,
  Save,
} from "lucide-react";
import { FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa6";
import toast from "react-hot-toast";
import { get, patch, imageUrl } from "@/ApisRequests/server";
import LinkedInImageCropModal from "@/components/UpdateProfile/client/LinkedInImageCropModal";
import defaultPlayer from "@/Assets/playerDefult.jpg";
import ptLogo from "@/Assets/PT Logo.png";

interface TeamItem {
  _id: string;
  name: string;
  team_logo?: string;
  sport?: string;
  league?: {
    _id: string;
    name: string;
  } | string;
}

interface PlayerUpdateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: any;
  onSuccess?: () => void;
  onEmailChange?: (newEmail: string) => void;
}

const COMMON_POSITIONS = [
  "Guard",
  "Point Guard",
  "Shooting Guard",
  "Forward",
  "Small Forward",
  "Power Forward",
  "Center",
  "Quarterback",
  "Running Back",
  "Wide Receiver",
  "Tight End",
  "Linebacker",
  "Cornerback",
  "Safety",
  "Midfielder",
  "Defender",
  "Goalkeeper",
  "Striker",
  "Pitcher",
  "Catcher",
  "Infielder",
  "Outfielder",
  "Sprinter",
  "Athlete",
];

const CLASS_YEARS = [
  "Freshman",
  "Sophomore",
  "Junior",
  "Senior",
  "Graduate Student",
  "Redshirt Freshman",
  "Redshirt Sophomore",
  "Redshirt Junior",
  "Redshirt Senior",
];

export const PlayerUpdateProfileModal: React.FC<PlayerUpdateProfileModalProps> = ({
  isOpen,
  onClose,
  player,
  onSuccess,
  onEmailChange,
}) => {
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [position, setPosition] = useState("");
  const [jerceyNumber, setJerceyNumber] = useState("");
  const [school, setSchool] = useState("");
  const [classYear, setClassYear] = useState("");
  const [experience, setExperience] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [tiktok, setTiktok] = useState("");

  // Team & League selection
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedLeagueId, setSelectedLeagueId] = useState("");
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [teamSearch, setTeamSearch] = useState("");
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const teamDropdownRef = useRef<HTMLDivElement>(null);

  // Image cropping state
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [rawImageFile, setRawImageFile] = useState<File | null>(null);
  const [croppedImageFile, setCroppedImageFile] = useState<File | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form when player prop changes or modal opens
  useEffect(() => {
    if (player && isOpen) {
      setName(player.name || "");
      setEmail(player.email || player.user?.email || "");
      setBio(player.bio || "");
      setPosition(player.position || "");
      setJerceyNumber(player.jerceyNumber || "");
      setSchool(player.school || "");
      setClassYear(player.classYear || "");
      setExperience(player.experience || "");
      setCity(player.city || "");
      setState(player.state || "");
      setCountry(player.country || "USA");
      setInstagram(player.instagram || "");
      setTwitter(player.twitter || "");
      setTiktok(player.tiktok || "");

      const pTeamId =
        typeof player.team === "object" ? player.team?._id : player.team || "";
      setSelectedTeamId(pTeamId);

      const pLeagueId =
        typeof player.league === "object"
          ? player.league?._id
          : typeof player.team === "object" &&
            typeof player.team?.league === "object"
            ? player.team.league._id
            : typeof player.team?.league === "string"
              ? player.team.league
              : player.league || "";
      setSelectedLeagueId(pLeagueId);

      setPreviewUrl(
        player.player_image ? imageUrl(player.player_image) : defaultPlayer.src
      );
      setCroppedImageFile(null);
      setRawImageFile(null);
    }
  }, [player, isOpen]);

  // Load teams list for team selector
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    const fetchTeams = async () => {
      setLoadingTeams(true);
      try {
        const res = await get("/team/get-all?limit=100&page=1");
        if (isMounted && res?.data?.result) {
          setTeams(res.data.result);
        }
      } catch (err) {
        console.error("Failed to load teams:", err);
      } finally {
        if (isMounted) setLoadingTeams(false);
      }
    };

    fetchTeams();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Close team dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        teamDropdownRef.current &&
        !teamDropdownRef.current.contains(e.target as Node)
      ) {
        setIsTeamDropdownOpen(false);
      }
    };

    if (isTeamDropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isTeamDropdownOpen]);

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
    toast.success("Profile photo adjusted! Save changes to apply.");
  };

  // Selected team object
  const currentSelectedTeam = teams.find((t) => t._id === selectedTeamId) || (
    typeof player?.team === "object" && player?.team?.name
      ? (player.team as TeamItem)
      : null
  );

  const filteredTeams = teams.filter((t) =>
    t.name.toLowerCase().includes(teamSearch.toLowerCase().trim())
  );

  const handleSelectTeam = (t: TeamItem) => {
    setSelectedTeamId(t._id);
    const lId =
      typeof t.league === "object"
        ? t.league?._id
        : typeof t.league === "string"
          ? t.league
          : "";
    if (lId) {
      setSelectedLeagueId(lId);
    }
    setIsTeamDropdownOpen(false);
    setTeamSearch("");
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Full Name is required");
      return;
    }
    if (!position.trim()) {
      toast.error("Position is required");
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
      toast.error("Please sign in to update your profile");
      return;
    }

    // Build partial dirty fields payload
    const dirtyFields: Record<string, string> = {};

    const initialName = (player?.name || "").trim();
    if (name.trim() !== initialName) dirtyFields.name = name.trim();

    const initialPosition = (player?.position || "").trim();
    if (position.trim() !== initialPosition) dirtyFields.position = position.trim();

    const initialBio = (player?.bio || "").trim();
    if (bio.trim() !== initialBio) dirtyFields.bio = bio.trim();

    const initialEmail = (
      player?.email ||
      player?.user?.email ||
      ""
    )
      .trim()
      .toLowerCase();
    const newEmail = email.trim().toLowerCase();
    const isEmailChanged = newEmail !== "" && newEmail !== initialEmail;
    if (isEmailChanged) dirtyFields.email = email.trim();

    const initialJersey = (player?.jerceyNumber || "").trim();
    if (jerceyNumber.trim() !== initialJersey)
      dirtyFields.jerceyNumber = jerceyNumber.trim();

    const initialSchool = (player?.school || "").trim();
    if (school.trim() !== initialSchool) dirtyFields.school = school.trim();

    const initialClassYear = (player?.classYear || "").trim();
    if (classYear.trim() !== initialClassYear)
      dirtyFields.classYear = classYear.trim();

    const initialExp = (player?.experience || "").trim();
    if (experience.trim() !== initialExp)
      dirtyFields.experience = experience.trim();

    const initialCity = (player?.city || "").trim();
    if (city.trim() !== initialCity) dirtyFields.city = city.trim();

    const initialState = (player?.state || "").trim();
    if (state.trim() !== initialState) dirtyFields.state = state.trim();

    const initialCountry = (player?.country || "USA").trim();
    if (country.trim() !== initialCountry) dirtyFields.country = country.trim();

    const cleanIg = instagram.trim().replace(/^@/, "");
    const initialIg = (player?.instagram || "").trim().replace(/^@/, "");
    if (cleanIg !== initialIg) dirtyFields.instagram = cleanIg;

    const cleanTwitter = twitter.trim().replace(/^@/, "");
    const initialTwitter = (player?.twitter || "").trim().replace(/^@/, "");
    if (cleanTwitter !== initialTwitter) dirtyFields.twitter = cleanTwitter;

    const cleanTiktok = tiktok.trim().replace(/^@/, "");
    const initialTiktok = (player?.tiktok || "").trim().replace(/^@/, "");
    if (cleanTiktok !== initialTiktok) dirtyFields.tiktok = cleanTiktok;

    const initialTeamId =
      typeof player?.team === "object" ? player?.team?._id : player?.team;
    if (selectedTeamId && selectedTeamId !== initialTeamId) {
      dirtyFields.team = selectedTeamId;
      if (selectedLeagueId) {
        dirtyFields.league = selectedLeagueId;
      }
    }

    const hasImageChange = Boolean(croppedImageFile);
    const hasFieldChanges = Object.keys(dirtyFields).length > 0;

    if (!hasImageChange && !hasFieldChanges) {
      toast("No profile changes detected");
      onClose();
      return;
    }

    setIsSaving(true);
    try {
      let res: any;

      if (hasImageChange) {
        const formData = new FormData();
        if (hasFieldChanges) {
          formData.append("data", JSON.stringify(dirtyFields));
        }
        formData.append("player_image", croppedImageFile as File);

        res = await patch("/player/profile", formData, {
          headers: {
            Authorization: `${token}`,
          },
        });
      } else {
        res = await patch("/player/profile", dirtyFields, {
          headers: {
            Authorization: `${token}`,
          },
        });
      }

      setIsSaving(false);

      if (res?.success) {
        toast.success(res?.message || "Player profile updated successfully!");
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
          "Failed to update player profile"
        );
      }
    } catch (err: any) {
      setIsSaving(false);
      console.error("Profile update error:", err);
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        "An error occurred while updating profile"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md overflow-y-auto">
      {/* Modal Dialog Card with Apple Continuous Squircles */}
      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-[28px] sm:rounded-[32px] border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Header Bar */}
        <div className="px-5 sm:px-7 py-4.5 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#053697]/10 text-[#053697] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Edit Athlete Profile
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Update your athletic details, team info, and public dossier
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
          {/* Section 1: Photo & Primary Identity */}
          <div className="p-4 sm:p-5 rounded-[22px] bg-slate-50/70 border border-slate-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
              {/* Avatar Preview with Camera Overlay */}
              <div className="relative group shrink-0">
                <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-[22px] ring-4 ring-white border border-slate-200/90 overflow-hidden bg-slate-900">
                  <Image
                    src={previewUrl || defaultPlayer.src}
                    alt="Player Profile Preview"
                    fill
                    sizes="96px"
                    className="object-cover object-top"
                    onError={() => setPreviewUrl(defaultPlayer.src)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-[#053697] hover:bg-[#042870] active:scale-[0.98] text-white rounded-full border-2 border-white transition-all cursor-pointer"
                  title="Upload New Photo"
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
                  Profile Photo
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Upload a high-resolution headshot. Supports PNG, JPG, or WebP
                  up to 10MB. You can crop, zoom, and adjust filters after selecting.
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-[#053697] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Choose Photo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Inputs: Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                  <span>Full Name</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Jordan Lee"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#053697] focus:ring-1 focus:ring-[#053697] outline-none text-slate-900 font-medium text-xs sm:text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
                  <span>Email Address</span>
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
                    placeholder="e.g. athlete@domain.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#053697] focus:ring-1 focus:ring-[#053697] outline-none text-slate-900 font-medium text-xs sm:text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Bio / NIL Statement */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
                <span>NIL Statement / Bio</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {bio.length}/500
                </span>
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 500))}
                rows={2}
                placeholder="Share your athletic goals, personal statement, or shoutout to your fans..."
                className="w-full p-3 rounded-xl bg-white border border-slate-200 focus:border-[#053697] focus:ring-1 focus:ring-[#053697] outline-none text-slate-900 font-medium text-xs sm:text-sm transition-all resize-none"
              />
            </div>
          </div>

          {/* Section 2: Athletic Dossier */}
          <div className="p-4 sm:p-5 rounded-[22px] bg-slate-50/70 border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-200/60">
              <Award className="w-4 h-4 text-[#053697]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Athletic Roster Details
              </h3>
            </div>

            {/* Team Selector Dropdown */}
            <div className="space-y-1.5" ref={teamDropdownRef}>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
                <span>Assigned Team & League</span>
                <span className="text-[10px] text-slate-400">
                  Coupled with official league
                </span>
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsTeamDropdownOpen((prev) => !prev)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-left flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-200/80 overflow-hidden flex items-center justify-center shrink-0">
                      {currentSelectedTeam?.team_logo ? (
                        <Image
                          src={imageUrl(currentSelectedTeam.team_logo)}
                          alt={currentSelectedTeam.name}
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
                      {currentSelectedTeam?.name || "Select a team"}
                    </span>
                    {currentSelectedTeam?.sport && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600 uppercase font-mono hidden sm:inline-block">
                        {currentSelectedTeam.sport}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${isTeamDropdownOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isTeamDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl z-30 overflow-hidden max-h-60 flex flex-col">
                    <div className="p-2 border-b border-slate-100 bg-slate-50/80">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={teamSearch}
                          onChange={(e) => setTeamSearch(e.target.value)}
                          placeholder="Search teams..."
                          className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#053697]"
                        />
                      </div>
                    </div>

                    <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
                      {loadingTeams ? (
                        <div className="p-4 text-center text-slate-400 flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-[#053697]" />
                          <span>Loading teams...</span>
                        </div>
                      ) : filteredTeams.length === 0 ? (
                        <div className="p-4 text-center text-slate-400 text-xs">
                          No matching teams found
                        </div>
                      ) : (
                        filteredTeams.map((t) => {
                          const isSelected = t._id === selectedTeamId;
                          const lName =
                            typeof t.league === "object"
                              ? t.league?.name
                              : "";
                          return (
                            <button
                              key={t._id}
                              type="button"
                              onClick={() => handleSelectTeam(t)}
                              className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between transition-colors cursor-pointer ${isSelected
                                  ? "bg-[#053697]/10 text-[#053697]"
                                  : "hover:bg-slate-50 text-slate-800"
                                }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200/70 overflow-hidden flex items-center justify-center shrink-0">
                                  {t.team_logo ? (
                                    <Image
                                      src={imageUrl(t.team_logo)}
                                      alt={t.name}
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
                                    {t.name}
                                  </div>
                                  {lName && (
                                    <div className="text-[10px] text-slate-400 font-mono truncate">
                                      {lName}
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

            {/* Position & Jersey Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                  <span>Position</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    list="positions-datalist"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                    placeholder="e.g. Guard, Forward"
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#053697] focus:ring-1 focus:ring-[#053697] outline-none text-slate-900 font-medium text-xs sm:text-sm uppercase transition-all"
                  />
                  <datalist id="positions-datalist">
                    {COMMON_POSITIONS.map((pos) => (
                      <option key={pos} value={pos} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                  <span>Jersey Number</span>
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={jerceyNumber}
                    onChange={(e) => setJerceyNumber(e.target.value)}
                    placeholder="e.g. 23"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#053697] focus:ring-1 focus:ring-[#053697] outline-none text-slate-900 font-mono font-bold text-xs sm:text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            {/* School, Class Year, Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  School / College
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="e.g. Duke University"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#053697] focus:ring-1 focus:ring-[#053697] outline-none text-slate-900 font-medium text-xs sm:text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Class Year
                </label>
                <input
                  type="text"
                  list="class-years-datalist"
                  value={classYear}
                  onChange={(e) => setClassYear(e.target.value)}
                  placeholder="e.g. Senior"
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#053697] focus:ring-1 focus:ring-[#053697] outline-none text-slate-900 font-medium text-xs sm:text-sm transition-all"
                />
                <datalist id="class-years-datalist">
                  {CLASS_YEARS.map((yr) => (
                    <option key={yr} value={yr} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Experience
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 3 Years"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#053697] focus:ring-1 focus:ring-[#053697] outline-none text-slate-900 font-medium text-xs sm:text-sm transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="p-4 sm:p-5 rounded-[22px] bg-slate-50/70 border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-200/60">
              <MapPin className="w-4 h-4 text-slate-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Location Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Durham"
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#053697] focus:ring-1 focus:ring-[#053697] outline-none text-slate-900 font-medium text-xs sm:text-sm transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  State / Region
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. North Carolina"
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#053697] focus:ring-1 focus:ring-[#053697] outline-none text-slate-900 font-medium text-xs sm:text-sm transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. USA"
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#053697] focus:ring-1 focus:ring-[#053697] outline-none text-slate-900 font-medium text-xs sm:text-sm transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Social Media Accounts */}
          <div className="p-4 sm:p-5 rounded-[22px] bg-slate-50/70 border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-200/60">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                Social Accounts
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

