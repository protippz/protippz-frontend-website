"use client";

import { useEffect, useState } from "react";
import PlayerzCards from "../Playerz/PlayerzCards";
import { get } from "@/ApisRequests/server";
import { Player } from "@/app/(default)/playerz/page";
import Link from "next/link";
import { UserX, ArrowUpRight } from "lucide-react";

interface FavoritePlayerzProps {
  initialPlayers?: Player[];
  token?: string | null;
}

const FavoritePlayerz: React.FC<FavoritePlayerzProps> = ({
  initialPlayers,
  token: initialToken,
}) => {
  const [playersData, setPlayersData] = useState<Player[]>(
    initialPlayers || []
  );
  const [token, setToken] = useState<string | null>(initialToken || null);
  const [loading, setLoading] = useState<boolean>(!initialPlayers);

  useEffect(() => {
    if (!token && typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, [token]);

  useEffect(() => {
    if (initialPlayers) {
      setPlayersData(initialPlayers);
      setLoading(false);
      return;
    }

    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    get("/player-bookmark/my-bookmark?limit=9999999", {
      headers: {
        Authorization: `${token}`,
      },
    })
      .then((res) => {
        const player =
          res?.data?.map((item: any) => ({
            ...item?.player,
            isBookmark: true,
          })) || [];
        setPlayersData(player.filter((item: any) => item && item._id));
      })
      .catch((err) => {
        console.error("Failed to load favorite players:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, initialPlayers]);

  if (loading) {
    return (
      <div className="w-full space-y-4 sm:space-y-6">
        <div className="w-full h-72 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="w-full h-72 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (playersData.length === 0) {
    return (
      <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-2xl my-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#053697] mb-3">
          <UserX className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900">
          No Favorite Athletes Yet
        </h3>
        <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
          You haven&apos;t saved any collegiate athletes yet. Star athletes on the roster to keep track of their performance, earn rewards, and send direct tips!
        </p>
        <Link
          href="/playerz"
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#053697] hover:bg-[#053697]/90 text-white transition-colors shadow-xs"
        >
          <span>Discover Athletes</span>
          <ArrowUpRight className="w-4 h-4 text-blue-200" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1">
      {playersData.map((item) => (
        <PlayerzCards item={item} key={item?._id} token={token} />
      ))}
    </div>
  );
};

export default FavoritePlayerz;
