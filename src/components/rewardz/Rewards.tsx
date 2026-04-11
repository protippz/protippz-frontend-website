import { get, imageUrl } from "@/ApisRequests/server";
import category from "@/Assets/category.png";
import { Tooltip } from "antd";
import Image from "next/image";
import SetTemParams from "../Playerz/Client/SetTemParams";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

interface RewardInterface {
  _id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  deliveryOption: string;
}

const Rewards = async () => {
  const [data] = await getCategory();
  console.log(imageUrl(data?.[0]?.image))
  const teamLogos = data as RewardInterface[];
  return (
    <Carousel className="w-full">
      <CarouselPrevious className={`md:-left-4 left-0 z-50`} />
      <CarouselContent className="flex items-center justify-center">
        {teamLogos &&
          Array.isArray(teamLogos) &&
          teamLogos.map((team) => (
            <CarouselItem
              key={team?._id}
              className="basis-1/4 md:basis-1/7 lg:basis-1/12"
            >
              <Tooltip placement="top" title={team?.name}>
                <div className="relative hover:bg-slate-100 cursor-pointer flex flex-col items-center justify-center">
                  <Image
                    src={team?.image ? imageUrl(team?.image) : category}
                    alt={team?.name}
                    className="w-[100px] h-[100px] object-contain"
                    height={100}
                    width={100}
                    unoptimized
                  />
                  <p className="text-center line-clamp-1 text-sm">
                    {team?.name?.slice(0, 10)}..
                  </p>

                  <SetTemParams
                    key={team?._id}
                    ParamKey="category"
                    value={team?._id}
                  />
                </div>
              </Tooltip>
            </CarouselItem>
          ))}
      </CarouselContent>
      <CarouselNext className={`md:-right-4 right-0`} />
    </Carousel>
  );
};

export default Rewards;
const getCategory = async () => {
  const res = await get("/reward-category/get-all?limit=999999999", {});
  return [res?.data?.result, res?.data?.meta];
};
