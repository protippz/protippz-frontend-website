import { get } from "@/ApisRequests/server";
import InfinitePlayerList from "@/components/Playerz/Client/InfinitePlayerList";
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
    <div className="max-w-355 mx-auto mt-2 sm:mt-3 px-2 sm:px-4 pb-14">
      <GoToTop />

      {/* Unified Master Container Card: Sticky shell with independent scrolling for sidebar and cards */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-200 lg:sticky lg:top-[64px] h-[calc(100dvh-120px)] sm:h-[calc(100dvh-125px)] lg:h-[calc(100vh-125px)] min-h-[460px] sm:min-h-[520px] lg:min-h-[550px]">
        {/* Left Column: Team Filter Sidebar (shrink-0 on mobile/tablet, full height scrollable on desktop) */}
        <aside className="w-full shrink-0 lg:w-72 xl:w-80 lg:shrink-0 bg-white lg:h-full flex flex-col overflow-hidden">
          <Suspense
            fallback={
              <div className="w-full h-14 lg:h-full bg-white animate-pulse" />
            }
          >
            <Teams />
          </Suspense>
        </aside>

        {/* Right Column: Scrollable Players Area */}
        <main className="flex-1 min-w-0 flex flex-col h-full min-h-0 overflow-hidden bg-[#fafbfb]">
          {/* Cards Content Area: Independently Scrollable */}
          <div className="flex-1 overflow-y-auto custom-sidebar-scrollbar min-h-0">
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
        </main>
      </div>
    </div>
  );
};

export default PlayerZPage;
