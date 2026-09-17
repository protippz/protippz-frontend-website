"use client";
import { useContextData } from "@/provider/ContextProvider";
import Link from "next/link";
import React from "react";
import MotionDiv from "../Playerz/Motion";
import Head from "next/head";

const Banner = () => {
  const data = useContextData();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <Head>
        <title>protippz</title>
        <meta name="description" content="protippz" />
        <meta name="keywords" content="protippz" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="protippz" />
        <meta property="og:description" content="protippz" />

        <meta property="og:url" content="https://protippz.com" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="protippz" />
        <meta name="twitter:description" content="protippz" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Website",
            name: "Best Sports Tipping Platform",
            url: "https://protippz.com",
            description: "protippz",
            publisher: {
              "@type": "Organization",
              name: "PROTIPPZ",
              logo: "https://protippz.com",
            },
          })}
        </script>
      </Head>
      <div
        className="relative w-full h-[500px] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: "url(https://i.ibb.co.com/cXf1gL5/image-1.png)",
        }}
      >
        <div className="absolute w-full h-full bg-black opacity-50 z-10"></div>
        <MotionDiv
          className="max-w-355 mx-auto text-left text-white z-30 md:p-0 p-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <MotionDiv
            className="text-4xl md:text-7xl font-my tracking-wider italic font-black mb-4"
            variants={childVariants}
          >
            {/* Start Tipping */}
            TIP YOUR FAV PLAYERS
          </MotionDiv>
          <MotionDiv
            className="text-4xl md:text-7xl font-my tracking-wider italic text-[#2FC292] font-black mb-4"
            variants={childVariants}
          >
            {/* Bridging the income gap between women and men sports */}
            EARN REWARDS
          </MotionDiv>
          <MotionDiv
            className="text-4xl md:text-7xl font-my tracking-wider italic text-[#043697] font-black mb-12"
            variants={childVariants}
          >
            {/* Start Tipping */}
            WIN PRIZES
          </MotionDiv>
          {data?.userData?._id ? (
            <MotionDiv variants={childVariants}>
              <Link
                href={`/playerz`}
                className="bg-[#053697] hover:bg-[#053697]/90 text-white font-semibold py-3 px-6 rounded-lg transition-all"
              >
                Send Tippz
              </Link>
            </MotionDiv>
          ) : (
            <MotionDiv variants={childVariants}>
              <Link
                href={`/sign-up`}
                className="bg-[#053697] hover:bg-[#053697]/90 text-white font-semibold py-3 px-6 rounded-lg transition-all"
              >
                Sign Up Now
              </Link>
            </MotionDiv>
          )}
        </MotionDiv>
      </div>
    </>
  );
};

export default Banner;
