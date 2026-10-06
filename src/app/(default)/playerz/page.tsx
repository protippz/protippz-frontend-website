import { get } from "@/ApisRequests/server";
import InfinitePlayerList from "@/components/Playerz/Client/InfinitePlayerList";
import SearchAndSortComponent from "@/components/Playerz/SearchAndSortComponent";
import Teams from "@/components/Playerz/Teams";
import GoToTop from "@/components/ui/GoToTop";
import { cookies } from "next/headers";
import { Suspense } from "react";

export const metadata = {
  title: "PROTIPPZ - PLAYERZ",
  description:
    "Learn how to tip your favorite player/team, earn rewards, and win prizes with TIPPZ.",
};

export interface Player {
  _id: string;
  name: string;
  league: {
    _id: string;
    name: string;
    sport: string;
  };
  team: {
    _id: string;
    name: string;
  };
  position: string;
  player_image: string;
  jerceyNumber: string;
  experience: string;
  player_bg_image: string;
  totalTips: number;
  paidAmount: number;
  dueAmount: number;
  isBookmark: boolean;
}

interface ParamsProps {
  searchParams: Promise<any>;
}

const PlayerZPage = async ({ searchParams }: ParamsProps) => {
  const { searchTerm, sort, page, team, limit } = await searchParams;

  const param = {
    searchTerm: searchTerm || undefined,
    sort: sort || undefined,
    page: page || "1",
    limit: limit || "20",
    team: team || undefined,
  };
  const cookie = cookies();
  const token = (await cookie).get("token")?.value;

  const paramsUrl = Object.entries(param)
    .filter(([key, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const res = await get(`/player/get-all?${paramsUrl}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  const data = res.data?.result;
  const meta = res.data?.meta;

  return (
    <div className="max-w-355 mx-auto mt-6 sm:mt-8">
      <GoToTop />

      {/* Sticky Filter & Search Control Header */}
      <div className="sticky top-[52px] sm:top-[58px] z-30 bg-[#fafbfb]/95 backdrop-blur-md pt-2 pb-2 space-y-3">
        <Suspense
          fallback={
            <div className="w-full h-14 bg-gray-100 animate-pulse rounded-2xl mb-3" />
          }
        >
          <Teams />
        </Suspense>
        <SearchAndSortComponent />
      </div>

      <InfinitePlayerList
        initialData={data || []}
        initialMeta={meta}
        token={token}
        searchTerm={searchTerm}
        sort={sort}
        team={team}
        limit={20}
      />
    </div>
  );
};

export default PlayerZPage;
