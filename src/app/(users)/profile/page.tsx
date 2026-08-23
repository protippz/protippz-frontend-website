"use client";
import { imageUrl } from "@/ApisRequests/server";
import { useContextData } from "@/provider/ContextProvider";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaMobile, FaRegUserCircle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";

const ProfilePage = () => {
  const data = useContextData();

  return (
    <div className="max-w-355 mx-auto p-8 text-center max-w-3xl">
      <h1 className="text-4xl font-extrabold text-[#053697] mb-6">
        Your Profile
      </h1>

      <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6">
        {/* Profile Image */}
        <Image
          width={120}
          height={120}
          unoptimized
          src={
            imageUrl(data?.userData?.profile_image || "") ||
            "https://i.ibb.co.com/f4tzYw2/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg"
          }
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-[#053697] object-cover mb-4"
        />

        {/* Name */}
        <h2 className="text-2xl font-bold text-[#053697] mb-2">
          {data?.userData?.name || "Guest User"}
        </h2>

        {/* Info Section */}
        <div className="w-full mt-4 space-y-4 text-left text-gray-700">
          <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg">
            <FaRegUserCircle className="text-[#053697] text-2xl" />
            <div>
              <p className="font-semibold text-sm">User Name</p>
              <p className="text-lg text-green-600">
                {data?.userData?.username || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg">
            <FaMobile className="text-[#053697] text-2xl" />
            <div>
              <p className="font-semibold text-sm">Phone Number</p>
              <p className="text-lg text-green-600">
                {data?.userData?.phone || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg">
            <MdEmail className="text-[#053697] text-2xl" />
            <div>
              <p className="font-semibold text-sm">Email</p>
              <p className="text-lg text-green-600">
                {data?.userData?.email || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg">
            <HiOutlineLocationMarker className="text-[#053697] text-2xl" />
            <div>
              <p className="font-semibold text-sm">Address</p>
              <p className="text-lg text-green-600">
                {typeof data?.userData?.address === "string"
                  ? data?.userData?.address || "N/A"
                  : data?.userData?.address?.streetAddress || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <Link
          href={`/profile/${data?.userData?._id}`}
          className="mt-8 inline-block bg-[#053697] text-white font-semibold py-3 px-10 rounded-full hover:bg-[#053697]/90 transition-transform transform hover:scale-105"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
