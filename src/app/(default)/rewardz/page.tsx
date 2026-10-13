import { get } from "@/ApisRequests/server";
import rewardbg from "@/Assets/rewardbgs.png";
import InfiniteRewardList from "@/components/rewardz/Client/InfiniteRewardList";
import Rewards from "@/components/rewardz/Rewards";
import GoToTop from "@/components/ui/GoToTop";
import { cookies } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";

export const metadata = {
  title: "PROTIPPZ - REWARDZ",
  description:
    "Earn points by sending Tippz and redeem them for exclusive merchandise, tickets, and cash prizes.",
};

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

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined | null }>;
}

const RewardzPage = async ({ searchParams }: PageProps) => {
  const { searchTerm, category, sort, page, limit } = await searchParams;
  const cookie = cookies();
  const token = (await cookie).get("token")?.value;

  const params = {
    category: category ? String(category) : undefined,
    searchTerm: searchTerm ? String(searchTerm) : undefined,
    sort: sort ? String(sort) : undefined,
    page: page ? String(page) : "1",
    limit: limit ? String(limit) : "20",
  };

  const [data, meta] = await getReward(params, token);
  const rewardData = (data || []) as RewardInterface[];

  return (
    <>
      <div className="max-w-355 mx-auto mt-2 sm:mt-3 px-2 sm:px-4 pb-14">
        <GoToTop />

        {/* Unified Master Container Card: Sticky shell with independent scrolling for sidebar and cards */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-200 lg:sticky lg:top-[64px] h-[calc(100dvh-120px)] sm:h-[calc(100dvh-125px)] lg:h-[calc(100vh-125px)] min-h-[460px] sm:min-h-[520px] lg:min-h-[550px]">
          {/* Left Column: Category Filter Sidebar (shrink-0 on mobile/tablet, full height scrollable on desktop) */}
          <aside className="w-full shrink-0 lg:w-72 xl:w-80 lg:shrink-0 bg-white lg:h-full flex flex-col overflow-hidden">
            <Suspense
              fallback={
                <div className="w-full h-14 lg:h-full bg-white animate-pulse" />
              }
            >
              <Rewards />
            </Suspense>
          </aside>

          {/* Right Column: Scrollable Rewards Area */}
          <main className="flex-1 min-w-0 flex flex-col h-full min-h-0 overflow-hidden bg-[#fafbfb]">
            {/* Cards Content Area: Independently Scrollable */}
            <div className="flex-1 overflow-y-auto custom-sidebar-scrollbar p-2.5 sm:p-4 min-h-0">
              <InfiniteRewardList
                initialData={rewardData}
                initialMeta={meta}
                token={token}
                searchTerm={params.searchTerm}
                sort={params.sort}
                category={params.category}
                limit={20}
              />
            </div>
          </main>
        </div>
      </div>

      {/* Promotional Banner */}
      <div
        style={{
          backgroundImage: `url(${rewardbg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="flex flex-col items-center justify-between mt-10 mb-10 box-border w-full"
      >
        <div className="w-full md:flex md:items-center md:justify-between max-w-355 mx-auto min-h-[600px] px-4">
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
              {["Sports Merchandise", "Cash Prizes", "Tickets & More"].map(
                (item, index) => (
                  <li
                    key={index}
                    className="flex items-center text-gray-700 justify-center md:justify-start"
                  >
                    <FaLongArrowAltRight className="text-[#053697] mr-2" />
                    <span>{item}</span>
                  </li>
                ),
              )}
            </ul>
            <div className="mt-4 flex justify-center md:justify-start">
              <Link
                target="_blank"
                href="https://play.google.com/store/apps/details?id=com.coryrains.protppz&hl=en"
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

const getReward = async (
  params: { [key: string]: string | undefined },
  token?: string
) => {
  const paramsUrl = Object.entries(params)
    .filter(([key, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const res = await get(`/reward/get-all?${paramsUrl}`, {
    headers: token ? { Authorization: `${token}` } : {},
  });
  return [res.data?.result, res.data?.meta];
};
