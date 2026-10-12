"use client";

import React, { useEffect, useState } from "react";
import TeamzCards from "../Teamz/TeamzCards";
import { get } from "@/ApisRequests/server";
import { TeamInterface } from "@/app/(default)/teamz/page";
import Link from "next/link";
import { ShieldAlert, ArrowUpRight } from "lucide-react";

interface FavoriteTeamzProps {
  initialTeams?: TeamInterface[];
  token?: string | null;
}

const FavoriteTeamz: React.FC<FavoriteTeamzProps> = ({
  initialTeams,
  token: initialToken,
}) => {
  const [teamsData, setTeamsData] = useState<TeamInterface[]>(
    initialTeams || []
  );
  const [token, setToken] = useState<string | null>(initialToken || null);
  const [loading, setLoading] = useState<boolean>(!initialTeams);

  useEffect(() => {
    if (!token && typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, [token]);

  useEffect(() => {
    if (initialTeams) {
      setTeamsData(initialTeams);
      setLoading(false);
      return;
    }

    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    get("/team-bookmark/my-bookmark?limit=9999999", {
      headers: {
        Authorization: `${token}`,
      },
    })
      .then((res) => {
        const teams =
          res?.data?.map((item: any) => ({
            ...item?.team,
            isBookmark: true,
          })) || [];
        setTeamsData(teams.filter((item: any) => item && item._id));
      })
      .catch((err) => {
        console.error("Failed to load favorite teams:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, initialTeams]);

  if (loading) {
    return (
      <div className="w-full space-y-4 sm:space-y-6">
        <div className="w-full h-72 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="w-full h-72 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (teamsData.length === 0) {
    return (
      <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-2xl my-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900">
          No Favorite Teams Yet
        </h3>
        <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
          You haven&apos;t saved any official collegiate teams yet. Follow your favorite programs across NCAA and college sports to support them directly.
        </p>
        <Link
          href="/teamz"
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#053697] hover:bg-[#053697]/90 text-white transition-colors shadow-xs"
        >
          <span>Browse Teams</span>
          <ArrowUpRight className="w-4 h-4 text-blue-200" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1">
      {teamsData.map((item) => (
        <TeamzCards item={item} key={item?._id} token={token} />
      ))}
    </div>
  );
};

export default FavoriteTeamz;
