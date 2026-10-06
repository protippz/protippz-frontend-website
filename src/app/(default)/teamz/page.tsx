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
    <div className="max-w-355 mx-auto mt-6 sm:mt-8">
      <GoToTop />

      {/* Sticky Filter & Search Control Header */}
      <div className="sticky top-[52px] sm:top-[58px] z-30 bg-[#fafbfb]/95 backdrop-blur-md pt-2 pb-2 space-y-3">
        <Suspense
          fallback={
            <div className="w-full h-14 bg-gray-100 animate-pulse rounded-2xl mb-3" />
          }
        >
          <League />
        </Suspense>
        {/* <AdContainer /> */}
        <SearchAndSortComponent />
      </div>

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