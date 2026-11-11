import { useContextData } from "@/provider/ContextProvider";
import { Award, Edit3, Instagram, Twitter, UserIcon } from "lucide-react";
import Link from "next/link";
import { FaTiktok } from "react-icons/fa";

interface MainBalancedDossierProps {
  onEditProfile?: () => void;
}

export default function MainBalancedDossier({ onEditProfile }: MainBalancedDossierProps = {}) {

    const context = useContextData();
    const player = context?.userData;
    // Address formatting
    const formattedAddress = player?.address?.streetAddress
        ? `${player?.address.streetAddress}, ${player?.address.city || player?.city || ""}, ${player?.address.state || player?.state || ""
            } ${player?.address.zipCode || ""}`.trim()
        : [player?.city, player?.state, player?.country]
            .filter(Boolean)
            .join(", ") || "No address on file";

    const teamName =
        typeof player?.team === "object" && player?.team?.name
            ? player?.team.name
            : typeof player?.team === "string"
                ? player?.team
                : "Independent Athlete";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-2 items-start">
            {/* Card 1: Athletic Dossier */}
            <div className="bg-white/95 backdrop-blur-xl rounded-[24px] sm:rounded-[26px] border border-slate-200/90 hover:border-slate-300 transition-colors duration-300 overflow-hidden ">
                <div className="px-5 py-3.5 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#053697]" />
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                            Athletic Dossier
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 rounded-full font-mono">
                            Roster
                        </span>
                        {onEditProfile && (
                            <button
                                type="button"
                                onClick={onEditProfile}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#053697]/10 hover:bg-[#053697]/20 text-[#053697] rounded-full text-[10px] font-bold transition-all active:scale-[0.98] cursor-pointer"
                                title="Edit Athletic Dossier"
                            >
                                <Edit3 className="w-3 h-3" />
                                <span>Edit</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                    <div className="px-5 py-3.5 flex items-center justify-between gap-2 bg-white/50">
                        <span className="font-medium text-slate-400">Team</span>
                        <span className="font-bold text-slate-900 text-right truncate">
                            {teamName}
                        </span>
                    </div>

                    <div className="px-5 py-3.5 flex items-center justify-between gap-2 bg-white/50">
                        <span className="font-medium text-slate-400">Position</span>
                        <span className="font-bold text-slate-900 text-right uppercase">
                            {player?.position || "N/A"}
                        </span>
                    </div>

                    <div className="px-5 py-3.5 flex items-center justify-between gap-2 bg-white/50">
                        <span className="font-medium text-slate-400">Jersey Number</span>
                        <span className="font-mono font-bold text-[#053697] text-right">
                            {player?.jerceyNumber ? `#${player?.jerceyNumber}` : "N/A"}
                        </span>
                    </div>

                    <div className="px-5 py-3.5 flex items-center justify-between gap-2 bg-white/50">
                        <span className="font-medium text-slate-400">Experience</span>
                        <span className="font-bold text-slate-900 text-right">
                            {player?.experience || "N/A"}
                        </span>
                    </div>

                    <div className="px-5 py-3.5 flex items-center justify-between gap-2 bg-white/50">
                        <span className="font-medium text-slate-400">School / College</span>
                        <span className="font-bold text-slate-900 text-right truncate">
                            {player?.school || "N/A"}
                        </span>
                    </div>

                    <div className="px-5 py-3.5 flex items-center justify-between gap-2 bg-white/50">
                        <span className="font-medium text-slate-400">Class Year</span>
                        <span className="font-bold text-slate-900 text-right">
                            {player?.classYear || "N/A"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Card 2: Account & Verification Dossier */}
            <div className="bg-white/95 backdrop-blur-xl rounded-[24px] sm:rounded-[26px] border border-slate-200/90 hover:border-slate-300 transition-colors duration-300 overflow-hidden ">
                <div className="px-5 py-3.5 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-[#2FC191]" />
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                            Account & Identity
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 rounded-full font-mono">
                            Verified
                        </span>
                        {onEditProfile && (
                            <button
                                type="button"
                                onClick={onEditProfile}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#053697]/10 hover:bg-[#053697]/20 text-[#053697] rounded-full text-[10px] font-bold transition-all active:scale-[0.98] cursor-pointer"
                                title="Edit Profile Details"
                            >
                                <Edit3 className="w-3 h-3" />
                                <span>Edit</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                    <div className="px-5 py-3.5 flex items-center justify-between gap-2 bg-white/50">
                        <span className="font-medium text-slate-400">Full Name</span>
                        <span className="font-bold text-slate-900 text-right truncate">
                            {player?.name || "N/A"}
                        </span>
                    </div>

                    <div className="px-5 py-3.5 flex items-center justify-between gap-2 bg-white/50">
                        <span className="font-medium text-slate-400">Username</span>
                        <span className="font-mono text-slate-700 text-right">
                            {player?.username ? `@${player?.username}` : "N/A"}
                        </span>
                    </div>

                    <div className="px-5 py-3.5 flex items-center justify-between gap-2 bg-white/50">
                        <span className="font-medium text-slate-400">Email Address</span>
                        <span className="font-semibold text-[#053697] text-right break-all">
                            {player?.email || player?.user?.email || "N/A"}
                        </span>
                    </div>

                    <div className="px-5 py-3.5 flex items-center justify-between gap-2 bg-white/50">
                        <span className="font-medium text-slate-400 shrink-0">
                            Payout Address
                        </span>
                        <div className="flex items-center gap-2 justify-end">
                            <span className="text-slate-800 font-medium text-right break-words text-xs sm:text-sm">
                                {formattedAddress}
                            </span>
                            <Link
                                href="/address"
                                className="p-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/70 text-[#053697] rounded-xl shrink-0 transition-colors"
                                title="Edit Address"
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Social Handles Sub-section in Clean Apple Pill Dock Style */}
                    <div className="px-5 py-3.5 bg-white/50">
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Social Accounts
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100/90 border border-slate-200/80 text-slate-700 text-xs rounded-xl truncate">
                                <Instagram className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                <span className="font-mono truncate">
                                    {player?.instagram ? `@${player?.instagram}` : "No IG"}
                                </span>
                            </span>

                            <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100/90 border border-slate-200/80 text-slate-700 text-xs rounded-xl truncate">
                                <Twitter className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                                <span className="font-mono truncate">
                                    {player?.twitter ? `@${player?.twitter}` : "No X"}
                                </span>
                            </span>

                            <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100/90 border border-slate-200/80 text-slate-700 text-xs rounded-xl truncate">
                                <FaTiktok className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                                <span className="font-mono truncate">
                                    {player?.tiktok ? `@${player?.tiktok}` : "No TikTok"}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}