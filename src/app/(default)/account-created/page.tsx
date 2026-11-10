import Link from "next/link";
import React from "react";

const Page = async () => {
  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="text-center p-6 bg-white rounded-lg">
        <h2 className="text-2xl font-semibold text-green-600">
          account added Successful!
        </h2>
        <p className="mt-2 text-gray-700 my-5">Thank you .</p>
        <Link
          href={`/`}
          className="mt-6 px-4 py-2 bg-[#053697] text-white font-bold rounded-lg hover:bg-[#053697]/90 transition-colors duration-300"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default Page;
