"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function PlayerWithdrawRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/home");
  }, [router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#053697] mb-3" />
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
        Redirecting to Athlete Portal...
      </p>
    </div>
  );
}
