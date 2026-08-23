import { get } from "@/ApisRequests/server";
import PaginationComponents from "@/components/Shared/Client/Pagination";
import { cookies } from "next/headers";
import Image from "next/image";
import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import brandLogo from "@/Assets/logo.png";

interface NotificationsType {
  _id: string;
  title: string;
  message: string;
  seen: boolean;
  createdAt: string;
}
const NotificationPage = async () => {
  const cookie = cookies();
  const token = (await cookie).get("token")?.value;
  // notification/get-notifications
  const res = await get("/notification/get-notifications", {
    headers: {
      Authorization: `${token}`,
    },
  });
  const data = res.data?.result as NotificationsType[];
  const meta = res.data?.meta;
  return (
    <div className="max-w-355 mx-auto p-4">
      {data?.length >= 1 ? (
        <div>
          <h1 className="text-4xl font-bold text-[#053697] mb-12 text-center">
            Notifications
          </h1>
          <div className="space-y-4">
            {data?.map((notification) => (
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h2 className="text-lg font-semibold text-[#053697]">
                    {notification.title}
                  </h2>
                  <p className="text-green-600">{notification.message}</p>
                </div>
                <div className="flex items-center text-green-500 space-x-2">
                  <AiOutlineClockCircle className="text-xl" />
                  <span className="text-sm">
                    {new Date(notification.createdAt).toLocaleDateString(
                      "en-US",
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center">
            <PaginationComponents paginationData={meta} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Image
            width={200}
            height={200}
            src={brandLogo}
            alt="brandLogo"
          ></Image>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
