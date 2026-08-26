import React, { memo } from "react";
import Image from "next/image";
import { imageUrl } from "@/ApisRequests/server";
import BookmarkButton from "../Shared/Client/BookmarkButton";
import bg from "@/Assets/bg.png";
import player from "@/Assets/playerDefult.jpg";
import { Player } from "@/app/(default)/playerz/page";
import SendTipsButton from "./Client/SendTipsButton";
import MotionDiv from "./Motion";

interface PlayerzCardsProps {
  item: Player;
  token: string | undefined | null;
}

const textReveal = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const cardReveal = {
  hidden: { y: "10%" },
  visible: {
    y: "0%",
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const PlayerzCards: React.FC<PlayerzCardsProps> = ({ token, item }) => {
  return (
    <MotionDiv
      variants={cardReveal}
      initial="hidden"
      animate="visible"
      className="relative border overflow-hidden border-green-300 rounded-lg shadow-md max-w-lg mx-auto w-full flex flex-col justify-between"
    >
      <div className="absolute h-full w-full ">
        <Image
          src={item?.player_bg_image ? imageUrl(item?.player_bg_image) : bg}
          alt={item.name}
          width={130}
          height={150}
          className="object-cover  rounded-md h-full w-full"
        />
      </div>
      <div className="absolute h-full w-full bg-white bg-opacity-80"></div>
      <div className=" p-4 z-40 ">
        <div className="flex flex-col justify-between pr-20 mt-6">
          <div className="text-left">
            <MotionDiv
              className="text-sm font-semibold text-green-500"
              variants={textReveal}
              initial="hidden"
              animate="visible"
            >
              Name
            </MotionDiv>
            <MotionDiv
              className="font-bold text-[#053697] text-lg"
              variants={textReveal}
              initial="hidden"
              animate="visible"
            >
              {item?.name}
            </MotionDiv>
            <MotionDiv
              className="text-sm font-semibold text-green-500 mt-2"
              variants={textReveal}
              initial="hidden"
              animate="visible"
            >
              Team
            </MotionDiv>
            <MotionDiv
              className="text-[#053697] w-10/12"
              variants={textReveal}
              initial="hidden"
              animate="visible"
            >
              {item?.team?.name}
            </MotionDiv>
            <MotionDiv
              variants={textReveal}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-2"
            >
              <MotionDiv className="text-sm font-semibold text-green-500 mt-2">
                Position :
              </MotionDiv>
              <MotionDiv className="text-sm mt-2 text-[#053697]">
                {item.position}
              </MotionDiv>
            </MotionDiv>
            <MotionDiv
              variants={textReveal}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-2"
            >
              <MotionDiv className="text-sm font-semibold text-green-500 mt-2">
                Jersey No.
              </MotionDiv>
              <MotionDiv className="text-sm mt-2 text-[#053697]">
                {item?.jerceyNumber || "N/A"}
              </MotionDiv>
            </MotionDiv>

            <MotionDiv
              variants={textReveal}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-2"
            >
              <MotionDiv className="text-sm font-semibold text-green-500 mt-2">
                Experience.
              </MotionDiv>
              <MotionDiv className="text-sm mt-2 text-[#053697]">
                {item?.experience || "N/A"}
              </MotionDiv>
            </MotionDiv>
          </div>
          <div className="absolute top-4 right-4 text-green-500 text-2xl">
            <BookmarkButton
              _id={item?._id}
              isBookmark={item?.isBookmark}
              type="player"
            />
          </div>
        </div>

        <div className="absolute -right-8 top-16 w-40 h-40 ">
          <Image
            src={item?.player_image ? imageUrl(item?.player_image) : player}
            alt={item.name}
            width={110}
            height={130}
            className="object-cover rounded-md"
            unoptimized={false}
          />
        </div>
      </div>
      <div className="flex justify-end m-2 z-1">
        <SendTipsButton token={token} item={item} />
      </div>
    </MotionDiv>
  );
};

export default memo(PlayerzCards);
