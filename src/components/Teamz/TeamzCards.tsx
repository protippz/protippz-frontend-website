import Image from "next/image";
import SendTipsButton from "./Client/SendTipsButton";
import { imageUrl } from "@/ApisRequests/server";
import BookmarkButton from "../Shared/Client/BookmarkButton";
import bg from "@/Assets/bg.png";
import league from "@/Assets/PT Logo.png";
import { TeamInterface } from "@/app/(default)/teamz/page";
import MotionDiv from "../Playerz/Motion";
interface TeamzCardsProps {
  item: TeamInterface;
  token: string | undefined | null;
}

const TeamzCards: React.FC<TeamzCardsProps> = ({ token, item }) => {
  const textReveal = {
    hidden: { y: "100%" },
    visible: {
      y: "0%",
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const cardReveal = {
    hidden: { y: "10%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };
  return (
    <MotionDiv
      variants={cardReveal}
      initial="hidden"
      animate="visible"
      className="relative border overflow-hidden border-green-300 rounded-lg shadow-md max-w-lg mx-auto h-72 flex flex-col justify-between w-full"
    >
      {/* Player Details Section */}
      <div className="absolute h-full w-full ">
        <Image
          src={item?.team_bg_image ? imageUrl(item?.team_bg_image) : bg}
          alt={item.name}
          width={130}
          height={150}
          className="object-cover rounded-md h-full w-full"
        />
      </div>
      <div className="absolute h-full w-full bg-white bg-opacity-80"></div>
      <div className="h-56 p-4 z-40">
        <div className="flex flex-col justify-between pr-20">
          <div className="text-left">
            <MotionDiv
              variants={textReveal}
              initial="hidden"
              animate="visible"
              className="text-sm font-semibold text-green-500"
            >
              Name
            </MotionDiv>
            <MotionDiv
              variants={textReveal}
              initial="hidden"
              animate="visible"
              className="font-bold w-9/12 text-[#053697] text-lg"
            >
              {item.name}
            </MotionDiv>
            <MotionDiv
              variants={textReveal}
              initial="hidden"
              animate="visible"
              className="text-sm font-semibold text-green-500 mt-2"
            >
              Sport
            </MotionDiv>
            <MotionDiv
              variants={textReveal}
              initial="hidden"
              animate="visible"
              className="text-[#053697]"
            >
              {item.league?.sport}
            </MotionDiv>
          </div>
          <div className="absolute top-4 right-4 text-green-500 text-2xl">
            {/* <span>{item.isBookmark ? '★' : '☆'}</span> */}
            <BookmarkButton
              isBookmark={item?.isBookmark}
              type="team"
              _id={item?._id}
            />
          </div>
        </div>

        <div className="absolute right-4 top-12 w-40 h-40">
          <Image
            src={item?.team_logo ? imageUrl(item.team_logo) : league}
            alt={item.name}
            width={100}
            height={100}
            className="object-cover rounded-md"
            unoptimized
          />
        </div>
      </div>
      <div className="flex justify-end m-2 z-50">
        <SendTipsButton token={token} item={item} />
      </div>
    </MotionDiv>
  );
};

export default TeamzCards;
