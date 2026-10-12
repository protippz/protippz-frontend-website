"use client";

import React from "react";
import { ShieldCheck, CheckCircle2, Sparkles, Building2 } from "lucide-react";
import { TeamDetailsData } from "./TeamDetailsView";

interface TeamAboutCardProps {
  team: TeamDetailsData;
}

const TeamAboutCard: React.FC<TeamAboutCardProps> = ({ team }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xs space-y-5">
      <div className="flex items-center gap-2">
        <Building2 className="w-5 h-5 text-[#053697]" />
        <h3 className="text-lg sm:text-xl font-black uppercase text-slate-900 tracking-tight">
          About {team.name}
        </h3>
      </div>

      {/* Program Bio */}
      <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4 sm:p-5 text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
        &ldquo;Official collegiate athletic program dedicated to competitive excellence, student-athlete development, high-performance training, and community engagement. Direct fan support empowers student-athletes with equipment, nutrition, wellness, and NIL growth.&rdquo;
      </div>

      {/* Key Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#2FC191] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-900">100% Direct Program Impact</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Tips flow directly to athletes and verified program initiatives.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#053697] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-900">Stripe & NCAA Compliant</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Secure institutional payouts audited under federal NIL guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamAboutCard;
