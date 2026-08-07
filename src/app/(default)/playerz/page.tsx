import { get } from '@/ApisRequests/server';
import InfinitePlayerList from '@/components/Playerz/Client/InfinitePlayerList';
import SearchAndSortComponent from '@/components/Playerz/SearchAndSortComponent';
import Teams from '@/components/Playerz/Teams';
import Heading from '@/components/Shared/Heading';
import GoToTop from '@/components/ui/GoToTop';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

export const metadata = {
  title: 'PROTIPPZ - PLAYERZ',
  description:
    'Learn how to tip your favorite player/team, earn rewards, and win prizes with TIPPZ.',
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
    page: page || '1',
    limit: limit || '12',
    team: team || undefined,
  };
  const cookie = cookies();
  const token = (await cookie).get('token')?.value;

  const paramsUrl = Object.entries(param)
    .filter(([key, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  const res = await get(`/player/get-all?${paramsUrl}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  const data = res.data?.result;
  const meta = res.data?.meta;

  return (
    <div className="container mx-auto mt-10">
      <GoToTop />
      <Suspense fallback={<div className="w-full h-24 bg-gray-100 animate-pulse rounded-lg my-4" />}>
        <Teams />
      </Suspense>

      <Heading headingText="PLAYERZ" subHeadingText="Select a Player" />
      <SearchAndSortComponent />
      <InfinitePlayerList
        initialData={data || []}
        initialMeta={meta}
        token={token}
        searchTerm={searchTerm}
        sort={sort}
        team={team}
        limit={12}
      />
    </div>
  );
};

export default PlayerZPage;
