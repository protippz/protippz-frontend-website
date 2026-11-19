import type { Metadata } from "next";
import { serverFetch } from "@/lib/api/server";
import { privateMetadata } from "@/lib/seo";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = privateMetadata("Payment Status");

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { PayerID, paymentId } = await searchParams;
  const res = await serverFetch(`/tip/execute-paypal-payment`, {
    method: "PATCH",
    body: { paymentId, payerId: PayerID },
  });
  if (res?.success) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <div className="text-center p-6 bg-white rounded-lg">
          <h2 className="text-2xl font-semibold text-green-600">
            Payment Successful!
          </h2>
          <p className="mt-2 text-gray-700 my-5">
            Thank you for your purchase. Your payment was successful.
          </p>
          <Link
            href={`/`}
            className="mt-6 px-4 py-2 bg-[#053697] text-white font-bold rounded-lg hover:bg-[#053697]/90 transition-colors duration-300"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="text-center p-6 bg-white rounded-lg">
        <h2 className="text-2xl font-semibold text-red-600">Payment Failed</h2>
        <p className="mt-2 text-gray-700 my-4">
          Oops! Something went wrong with your payment. Please try again.
        </p>
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
