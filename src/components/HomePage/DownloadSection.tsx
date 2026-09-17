"use client";
import appsore from "@/Assets/appsore.png";
import download from "@/Assets/Iphone update 14.png";
import playstore from "@/Assets/playstore.png";
import qrCode from "@/Assets/qrcode.png";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const DownloadSection = () => {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const translateX = useTransform(mouseX, [-200, 200], [-20, 20]);
  const translateY = useTransform(mouseY, [-200, 200], [-20, 20]);

  return (
    <section className="flex relative justify-center items-center pt-12 px-4 mt-20 md:mt-0  flex-col gap-10">
      <Head>
        {/* ✅ Primary Meta Tags */}
        <title>Download PROTIPPZ App - Best Sports Tipping Platform</title>
        <meta
          name="description"
          content="Download the PROTIPPZ app today! Available on Google Play. Tip your favorite players, earn rewards, and win prizes."
        />
        <meta
          name="keywords"
          content="download PROTIPPZ app, sports tipping app, best sports tipping platform, earn rewards, tip players online, Google Play"
        />
        <meta name="robots" content="index, follow" />

        {/* ✅ Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Download PROTIPPZ App - Available on Google Play"
        />
        <meta
          property="og:description"
          content="Tip your favorite players and teams, earn rewards, and win prizes with the PROTIPPZ app."
        />
        <meta property="og:image" content="/seo-image.jpg" />
        <meta property="og:url" content="https://protippz.com/download" />

        {/* ✅ Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Download PROTIPPZ App - Available on Google Play"
        />
        <meta
          name="twitter:description"
          content="Get the PROTIPPZ app now and start tipping your favorite players and teams. Earn rewards and join the best sports tipping community."
        />
        <meta name="twitter:image" content="/seo-image.jpg" />

        {/* ✅ Structured Data for Google (JSON-LD Schema) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "PROTIPPZ App",
            operatingSystem: "Android",
            applicationCategory: "Sports",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            downloadUrl:
              "https://play.google.com/store/apps/details?id=com.coryrains.protppz&hl=en",
            description:
              "Download PROTIPPZ, the best sports tipping app to tip players, earn rewards, and win prizes.",
            image: "https://protippz.com/assets/seo-banner.jpg",
          })}
        </script>
      </Head>
      <div>
        <h3 className="text-3xl text-center text-[#053697]">Download Today</h3>
        <p className="text-xl text-center text-[#2FC191]">
          Available on Google Play
        </p>
      </div>
      <div className="max-w-355 mx-auto flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12 relative">
        <motion.div
          className="bg-[#2FC191] relative p-1 lg:h-[500px] h-[400px] text-white w-full max-w-lg md:max-w-lg lg:max-w-xl md:px-12 text-center z-1 flex flex-col justify-center items-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            mouseX.set(0);
            mouseY.set(0);
          }}
          onMouseMove={handleMouseMove}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
          style={{ translateX, translateY, borderRadius: "500px" }}
        >
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            Download Our App
          </h2>
          <p className="md:text-base text-sm mb-6">
            Tip your favorite players and teams, earn rewards, win prizes, and
            join a community of passionate sports lovers.
          </p>
          <div className="flex flex-col items-center space-y-4">
            <div className="flex justify-between items-center gap-2">
              <div className="bg-white rounded-md">
                <Image
                  src={qrCode}
                  alt="Qr Code"
                  width={3000}
                  height={6000}
                  className="w-12 md:w-[90px] md:h-[90px]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href="https://play.google.com/store/apps/details?id=com.coryrains.protppz&hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={playstore}
                    alt="app store"
                    width={100}
                    height={100}
                  />
                </Link>
                <Link
                  href="https://apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={appsore}
                    alt="app store"
                    width={100}
                    height={100}
                  />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="relative md:relative  md:right-20 md:ml-10 md:top-0  lg:ml-20 md:z-1 ">
          <Image
            className="lg:w-72 md:w-60 w-48"
            src={download}
            alt="Mobile Mockup"
            width={300}
            height={600}
          />
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
