import { get } from "@/ApisRequests/server";
import Heading from "@/components/Shared/Heading";
import InfiniteTeamList from "@/components/Teamz/Client/InfiniteTeamList";
import SearchAndSortComponent from "@/components/Teamz/SearchAndSortComponent";
import Teams from "@/components/Teamz/Teams";
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
    <div className="max-w-355 mx-auto mt-10">
      <GoToTop />

      <Suspense
        fallback={
          <div className="w-full h-24 bg-gray-100 animate-pulse rounded-lg my-4" />
        }
      >
        <Teams />
      </Suspense>
      <Heading headingText="TEAMZ" subHeadingText="Select a Team " />
      {/* <AdContainer /> */}
      <SearchAndSortComponent />
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

// import { get } from '@/ApisRequests/server';
// import PaginationComponents from '@/components/Shared/Client/Pagination';
// import Heading from '@/components/Shared/Heading';
// import SearchAndSortComponent from '@/components/Teamz/SearchAndSortComponent';
// import Teams from '@/components/Teamz/Teams';
// import TeamzCards from '@/components/Teamz/TeamzCards';
// import GoToTop from '@/components/ui/GoToTop';
// import { Empty } from 'antd';
// import { SearchParams } from 'next/dist/server/request/search-params';
// import { cookies } from 'next/headers';

// export const metadata = {
//   title: 'PROTIPPZ - PLAYERZ',
//   description:
//     'Learn how to tip your favorite player/team, earn rewards, and win prizes with TIPPZ.',
// };

// export interface TeamInterface {
//   _id: string;
//   name: string;
//   team_logo: string;
//   league: {
//     _id: string;
//     name: string;
//     sport: string;
//   };
//   team_bg_image: string;
//   totalTips: number;
//   paidAmount: number;
//   dueAmount: number;
//   isBookmark: boolean;
// }

// interface ParamsProps {
//   searchParams: Promise<{ [key: string]: string | undefined | null }>;
// }

// const TeamPage = async ({ searchParams }: ParamsProps) => {
//   const { searchTerm, sort, page, league } = await searchParams;
//   const param = { searchTerm, sort: sort, page, league };
//   const [data, meta] = await getTeam(param);
//   const playersData = data as TeamInterface[];
//   const cookie = cookies();
//   const token = (await cookie).get('token')?.value;

//   return (
//     <div className="max-w-355 mx-auto mt-10">
//       <GoToTop />

//       <Teams />
//       <Heading headingText="TEAMZ" subHeadingText="Select a Team " />
//       {/* <AdContainer /> */}
//       <SearchAndSortComponent />
//       <div className="px-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
//         {playersData?.length > 0 ? (
//           playersData?.map((item) => <TeamzCards token={token} item={item} key={item?._id} />)
//         ) : (
//           <div className="col-span-3 py-28">
//             <Empty description="No Results Found. Search Again." />
//           </div>
//         )}
//       </div>
//       {playersData?.length > 0 && (
//         <div className="flex justify-center items-center">
//           <PaginationComponents paginationData={meta} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default TeamPage;

// const getTeam = async (param: SearchParams | {}) => {
//   const cookie = cookies();
//   const paramsUrl = Object.entries(param)
//     .filter(([key, value]) => value !== undefined)
//     .map(([key, value]) => `${key}=${value}`)
//     .join('&');
//   const res = await get(`/team/get-all?${paramsUrl}&limit=100`, {
//     headers: {
//       Authorization: `${(await cookie).get('token')?.value}`,
//     },
//   });
//   return [res.data?.result, res.data?.meta];
// };
