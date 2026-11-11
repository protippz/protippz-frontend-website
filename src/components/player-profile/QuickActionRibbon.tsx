import { FileText, History, HomeIcon, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface QuickActionRibbonProps {
    onOpenWithdraw?: () => void;
}

export default function QuickActionRibbon({ onOpenWithdraw }: QuickActionRibbonProps = {}) {
    const router = useRouter()
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-2.5">
            <Link
                href="/my-tip-history"
                className="p-3.5 bg-white/95 hover:bg-slate-50/90 border border-slate-200/90 hover:border-slate-300 rounded-[20px] sm:rounded-[22px] flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >

                <div className="min-w-0">
                    <h4 className="text-xs sm:text-xl font-bold text-slate-900 truncate">
                        Tippz History
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">View fan tips</p>
                </div>
            </Link>

            <button
                type="button"
                onClick={()=>{
                    router.push("/my-withdraw-history")
                }}
                className="p-3.5 bg-white/95 hover:bg-slate-50/90 border border-slate-200/90 hover:border-slate-300 rounded-[20px] sm:rounded-[22px] flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer text-left w-full"
            >
                <div className="min-w-0">
                    <h4 className="text-xs sm:text-xl font-bold text-slate-900 truncate">
                        Withdraw History
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">Bank Transfer</p>
                </div>
            </button>

            <Link
                href="/tax-information"
                className="p-3.5 bg-white/95 hover:bg-slate-50/90 border border-slate-200/90 hover:border-slate-300 rounded-[20px] sm:rounded-[22px] flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
                <div className="min-w-0">
                    <h4 className="text-xs sm:text-xl font-bold text-slate-900 truncate">
                        Tax Info
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">W-9 Forms</p>
                </div>
            </Link>

            <Link
                href="/address"
                className="p-3.5 bg-white/95 hover:bg-slate-50/90 border border-slate-200/90 hover:border-slate-300 rounded-[20px] sm:rounded-[22px] flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
                <div className="min-w-0">
                    <h4 className="text-xs sm:text-xl font-bold text-slate-900 truncate">
                        Address
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">Payout address</p>
                </div>
            </Link>
        </div>
    )
}