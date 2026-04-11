import { get } from '@/ApisRequests/server';
import rewardbg from '@/Assets/rewardbgs.png';
import Rewards from '@/components/rewardz/Rewards';
import RewardzCards from '@/components/rewardz/RewardzCards';
import SearchAndSortComponent from '@/components/rewardz/SearchAndSortComponent';
import PaginationComponents from '@/components/Shared/Client/Pagination';
import Heading from '@/components/Shared/Heading';
import GoToTop from '@/components/ui/GoToTop';
import { Empty } from 'antd';
import Link from 'next/link';
import { FaLongArrowAltRight } from 'react-icons/fa';

export interface RewardInterface {
  _id: string;
  category: {
    _id: string;
    name: string;
    deliveryOption: string;
  };
  name: string;
  reward_image: string;
  pointRequired: number;
  description: string;
}
interface searchParamsInterface {
  [key: string]: string | undefined | number;
}
interface PageProps {
  searchParams: Promise<searchParamsInterface>;
}
const RewardzPage = async ({ searchParams }: PageProps) => {
  const { searchTerm, category, page } = await searchParams;
  const params = { category, searchTerm, page };
  const [data, meta] = await getReward(params);
  const rewardData = data as RewardInterface[];
  return (
    <>
      <div className="container mx-auto mt-10">
        <GoToTop />
        <Rewards />
        <Heading headingText="REWARDZ" subHeadingText="Select a Reward" />
        {/* <AdContainer /> */}
        <SearchAndSortComponent />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {rewardData?.length > 0 ? (
            rewardData?.map((item) => (
              <RewardzCards item={item} key={item?._id} />
            ))
          ) : (
            <div className="col-span-3 py-28">
              <Empty description="No Results Found. Search Again." />
            </div>
          )}
        </div>
        {rewardData?.length > 0 ? (
          <div className="flex justify-center items-center">
            <PaginationComponents paginationData={meta} />
          </div>
        ) : (
          ''
        )}
      </div>
      <div
        style={{
          backgroundImage: `url(${rewardbg.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="flex flex-col items-center justify-between mb-10 box-border w-full"
      >
        <div className="w-full md:flex md:items-center md:justify-between container mx-auto  min-h-[600px]">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-[#053697] mb-4">
              Send Tippz. Earn Rewardz! Win Prizes!!
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              When you send Tippz you will earn reward points that can be
              redeemed for exclusive prizes and you will be entered into weekly
              drawings.
            </p>
            <ul className="mt-4 space-y-2">
              {['Sports Merchandise', 'Cash Prizes', 'Tickets & More'].map(
                (item, index) => (
                  <li
                    key={index}
                    className="flex items-center text-gray-700 justify-center md:justify-start"
                  >
                    <FaLongArrowAltRight className="text-[#053697] mr-2" />
                    <span>{item}</span>
                  </li>
                )
              )}
            </ul>
            <div className="mt-4 flex justify-center md:justify-start">
              <Link
                target="_blank"
                href="https://play.google.com/store/apps/details?id=com.protipz.cory"
                className="text-[#053697] font-semibold flex items-center"
              >
                Download Today <FaLongArrowAltRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RewardzPage;

const getReward = async (params: searchParamsInterface) => {
  const paramsUrl = Object.entries(params)
    .filter(([key, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  const res = await get(`/reward/get-all?${paramsUrl}&limit=200`);
  return [res.data?.result, res.data?.meta];
};
