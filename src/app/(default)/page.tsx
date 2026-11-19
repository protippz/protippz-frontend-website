import type { Metadata } from "next";
import ConnectionBoth from "@/components/HomePage/ConnectionBoth";
import FAQ from "@/components/HomePage/FAQ";
import ForAthletes from "@/components/HomePage/ForAthlets";
import HeroSection from "@/components/HomePage/HeroSection";
import HomeAuthRedirect from "@/components/HomePage/HomeAuthRedirect";
import HowItWork from "@/components/HomePage/HowItWork";
import WhyProtippzExist from "@/components/HomePage/WhyProtippzExist";
import { buildMetadata, DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: DEFAULT_TITLE,
  absoluteTitle: true,
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

export default function Home() {
  return (
    <>
      <HomeAuthRedirect />
      <HeroSection />
      <WhyProtippzExist />
      <HowItWork />
      <ForAthletes />
      <ConnectionBoth />
      <FAQ />
    </>
  );
}
