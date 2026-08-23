import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import rewardbg from "@/Assets/rewardbgs.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
function page() {
  return (
    <div
      style={{
        backgroundImage: `url(${rewardbg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="flex flex-col items-center justify-between mb-10 box-border w-full"
    >
      <div className="w-full md:flex md:items-center md:justify-between max-w-355 mx-auto  min-h-[600px]">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl font-bold text-[#053697] mb-4">
            Send Tippz. Earn Rewardz! Win Prizes!!
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            When you send Tippz you will earn reward points that can be redeemed
            for exclusive prizes and you will be entered into weekly drawings.
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
              href="https://play.google.com/store/apps/details?id=com.protipz.cory"
              className="text-[#053697] font-semibold flex items-center"
            >
              Download Today <FaLongArrowAltRight className="ml-2" />
            </Link>
          </div>
          <Link href="/sign-in">
            <Button className="bg-[#053697] mt-3 hover:bg-[#053697]/90">
              Sign In Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default page;
