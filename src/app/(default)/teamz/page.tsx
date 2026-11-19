import type { Metadata } from "next";
import InfiniteTeamList from "@/components/Teamz/Client/InfiniteTeamList";
import League from "@/components/Teamz/Teams";
import { getTeams } from "@/lib/api/queries";
import { getServerToken } from "@/lib/api/server";
import { buildMetadata } from "@/lib/seo";
import { Suspense } from "react";

export const metadata: Metadata = buildMetadata({
  title: "Teamz – Support Your Favorite Teams",
  description:
    "Discover teams across leagues on PROTIPPZ and support them with digital tips. Filter by league and find your favorite programs.",
  path: "/teamz",
});

export interface TeamInterface {
  _id: string;
  name: string;
  team_logo: string;
  league: {
    _id: string;
    name: string;
    sport: string;
  };
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
  const { result: data, meta } = await getTeams(param);
  const playersData = data as TeamInterface[];
  const token = await getServerToken();

  return (
    <div className="max-w-355 mx-auto mt-2 sm:mt-3 px-2 sm:px-4 pb-14">
      {/* // <GoToTop /> */}
      {/* Unified Master Container Card: Sticky shell with independent scrolling for sidebar and cards */}
      <div className="bg-white rounded-md border border-slate-200/90 overflow-hidden flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-200 lg:sticky lg:top-[64px] h-[calc(100dvh-120px)] sm:h-[calc(100dvh-125px)] lg:h-[calc(100vh-125px)] min-h-[460px] sm:min-h-[520px] lg:min-h-[550px]">
        {/* Left Column: League Filter Sidebar (shrink-0 on mobile, full height scrollable on desktop) */}
        <aside className="w-full shrink-0 lg:w-72 xl:w-80 lg:shrink-0 bg-white lg:h-full flex flex-col overflow-hidden">
          <Suspense
            fallback={
              <div className="w-full h-14 lg:h-full bg-white animate-pulse" />
            }
          >
            <League />
          </Suspense>
        </aside>

        {/* Right Column: Scrollable Cards Area */}
        <main className="flex-1 min-w-0 flex flex-col h-full min-h-0 overflow-hidden bg-[#fafbfb]">
          {/* Cards Content Area: Independently Scrollable */}
          <div className="flex-1 overflow-y-auto custom-sidebar-scrollbar p-2.5 sm:p-4 min-h-0">
            <InfiniteTeamList
              initialData={playersData || []}
              initialMeta={meta}
              token={token ?? undefined}
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

