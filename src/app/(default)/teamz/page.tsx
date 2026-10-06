import { get } from "@/ApisRequests/server";
import InfiniteTeamList from "@/components/Teamz/Client/InfiniteTeamList";
import SearchAndSortComponent from "@/components/Teamz/SearchAndSortComponent";
import League from "@/components/Teamz/Teams";
import GoToTop from "@/components/ui/GoToTop";
import { SearchParams } from "next/dist/server/request/search-params";
import { cookies } from "next/headers";
import { Suspense } from "react";

export const metadata = {
  title: "PROTIPPZ - TEAMZ",
  description:
    "Learn how to tip your favorite player/team, earn rewards, and win prizes with TIPPZ.",
};

export interface TeamInterface {
  _id: string;
  name: string;
  team_logo: string;
  league: {
    _id: string;
    name: string;
    sport: string;
  };
  team_bg_image: string;
  totalTips: number;
  paidAmount: number;
  dueAmount: number;
  isBookmark: boolean;
}

interface ParamsProps {
  searchParams: Promise<{ [key: string]: string | undefined | null }>;
}

const TeamPage = async ({ searchParams }: ParamsProps) => {
  const { searchTerm, sort, page, league, limit } = await searchParams;
  const param = {
    searchTerm: searchTerm || undefined,
    sort: sort || undefined,
    page: page || "1",
    limit: limit || "20",
    league: league || undefined,
  };
  const [data, meta] = await getTeam(param);
  const playersData = data as TeamInterface[];
  const cookie = cookies();
  const token = (await cookie).get("token")?.value;

  return (
    <div className="max-w-355 mx-auto mt-2 sm:mt-3 px-2 sm:px-4 pb-14">
      <GoToTop />

      {/* Unified Master Container Card: Sticky shell with independent scrolling for sidebar and cards */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-200 lg:sticky lg:top-[64px] h-[calc(100vh-125px)] min-h-[550px]">
        {/* Left Column: League Filter Sidebar (scrolls independently) */}
        <aside className="w-full lg:w-72 xl:w-80 lg:shrink-0 bg-white h-full flex flex-col overflow-hidden">
          <Suspense
            fallback={
              <div className="w-full h-full bg-white animate-pulse" />
            }
          >
            <League />
          </Suspense>
        </aside>

        {/* Right Column: Top Header + Scrollable Cards Area */}
        <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden bg-[#fafbfb]">
          {/* Top Header: Search & Sort Bar (fixed at top of main) */}
          <div className="shrink-0 bg-white border-b border-slate-200 z-10">
            <SearchAndSortComponent />
          </div>

          {/* Cards Content Area: Independently Scrollable */}
          <div className="flex-1 overflow-y-auto custom-sidebar-scrollbar p-4 sm:p-6 lg:p-7 min-h-0">
            <InfiniteTeamList
              initialData={playersData || []}
              initialMeta={meta}
              token={token}
              searchTerm={searchTerm || undefined}
              sort={sort || undefined}
              league={league || undefined}
              limit={20}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeamPage;

const getTeam = async (param: SearchParams | {}) => {
  const cookie = cookies();
  const paramsUrl = Object.entries(param)
    .filter(([key, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const res = await get(`/team/get-all?${paramsUrl}`, {
    headers: {
      Authorization: `${(await cookie).get("token")?.value}`,
    },
  });
  return [res.data?.result, res.data?.meta];
};