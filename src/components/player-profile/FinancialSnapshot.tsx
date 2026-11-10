import { useContextData } from "@/provider/ContextProvider";
import { ArrowUpRight, CheckCircle2, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";

interface FinancialSnapshotProps {
    onOpenWithdraw?: () => void;
}

export function FinancialSnapshot({ onOpenWithdraw }: FinancialSnapshotProps = {}) {
    const context = useContextData();
    const player = context?.userData;
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-2">
            {/* Widget 1: Total Tippz */}
            <div className="relative bg-white/95 backdrop-blur-xl rounded-[24px] p-5 border border-slate-200/90 hover:border-slate-300 transition-colors duration-300 flex flex-col justify-between ">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Total Direct Tips
                    </span>
                </div>
                <div className="mt-4">
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        ${Number(player?.totalTips || 0).toFixed(2)}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                        All-time fan tips & rewards generated
                    </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500">
                    <span>Supporters</span>
                    <span className="font-bold text-slate-800">
                        {player?.followersCount || 0} Followers
                    </span>
                </div>
            </div>

            {/* Widget 2: Available Balance */}
            <div className="relative bg-white/95 backdrop-blur-xl rounded-[24px] p-5 border border-slate-200/90 hover:border-slate-300 transition-colors duration-300 flex flex-col justify-between ">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#053697]">
                        Available Balance
                    </span>
                </div>
                <div className="mt-4">
                    <h3 className="text-2xl sm:text-3xl font-black text-[#053697] tracking-tight">
                        ${Number(player?.dueAmount || 0).toFixed(2)}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Ready for immediate withdrawal
                    </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Min. payout $10.00</span>
                    {onOpenWithdraw ? (
                        <button
                            type="button"
                            onClick={onOpenWithdraw}
                            className="font-bold text-[#053697] hover:text-[#042870] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                            <span>Withdraw Now</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                    ) : (
                        <Link
                            href="/home"
                            className="font-bold text-[#053697] hover:text-[#042870] flex items-center gap-1 transition-colors"
                        >
                            <span>Withdraw Now</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Widget 3: Total Withdrawn */}
            <div className="relative bg-white/95 backdrop-blur-xl rounded-[24px] p-5 border border-slate-200/90 hover:border-slate-300 sm:col-span-2 lg:col-span-1 transition-colors duration-300 flex flex-col justify-between ">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Total Withdrawn
                    </span>
                </div>
                <div className="mt-4">
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        ${Number(player?.paidAmount || 0).toFixed(2)}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Successfully disbursed to your account
                    </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500">
                    <span>Disbursement</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Up to date</span>
                    </span>
                </div>
            </div>
        </div>

    )
}