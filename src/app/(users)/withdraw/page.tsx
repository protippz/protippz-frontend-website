import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import withdraw from "@/Assets/withdraw.png";
import Link from "next/link";
const WithdrawPage = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${withdraw.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="flex flex-col items-center justify-between mb-10 box-border w-full"
    >
      <div className="w-full md:flex md:items-center md:justify-between max-w-355 mx-auto  min-h-[600px]">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl font-bold text-white mb-4">Withdraw Funds</h2>
          <p className="text-lg text-[#2FC191] mb-4">
            You can withdraw funds using a debit/credit card or your bank
            account.
          </p>
          <div className="mt-4 flex justify-center md:justify-start">
            <Link
              href="/withdraw/checkout"
              className="bg-[#053697]/90 text-white px-8 py-3 rounded-md font-semibold flex items-center"
            >
              Withdraw Funds
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;
