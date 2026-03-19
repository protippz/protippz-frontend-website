import { get, imageUrl } from "@/ApisRequests/server";
import bg from "@/Assets/bg.webp";
import { Tooltip } from "antd";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import SetTemParams from "./Client/SetTemParams";
interface teamsType {
  _id: string;
  name: string;
  team_logo: string;
  sport: string;
}
const Teams = async () => {
  const [data] = await getTeam();
  return (
    <Carousel className="w-full">
      <CarouselPrevious className={`md:-left-4 left-0 z-50`} />
      <CarouselContent className="flex items-center justify-start">
        {data &&
          Array.isArray(data) &&
          data?.map((team: teamsType) => (
            <CarouselItem
              key={team._id}
              className="basis-1/4  cursor-pointer md:basis-1/7 lg:basis-1/12 "
            >
              <Tooltip placement="bottom" title={<div className="flex flex-col items-center">
                <Image
                  src={imageUrl(team?.team_logo)}
                  alt={team.name}
                  className=" w-[40px] h-[40px] object-contain unselectable"
                  height={40}
                  width={40}
                />
                <p className="text-center text-sm">{team?.name}</p>
              </div>}>
                <div
                  className="relative hover:bg-slate-100 bg-center bg-contain bg-no-repeat w-28 h-28 overflow-hidden flex items-center justify-center flex-col unselectable">
                  <Image
                    src={
                      team?.team_logo ? imageUrl(team?.team_logo) : bg
                    }
                    alt={team.name}
                    className=" w-[40px] h-[40px] object-contain unselectable"
                    height={40}
                    width={40}
                  />
                  <p className="text-sm unselectable">{team?.name?.slice(0, 10)}..</p>
                  <SetTemParams ParamKey="team" value={team?._id} />
                </div>
              </Tooltip>
            </CarouselItem>
          ))}
      </CarouselContent>
      <CarouselNext className={`md:-right-4 right-0`} />
    </Carousel>
  );
};

export default Teams;
const getTeam = async () => {
  const res = await get("/team/get-all?limit=999999999");
  return [res.data?.result, res.data?.meta];
};
