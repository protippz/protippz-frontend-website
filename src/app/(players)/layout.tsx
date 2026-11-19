import type { Metadata } from "next";
import Navbar from "@/components/Shared/Client/Navbar";
import Footer from "@/components/Shared/Client/Footer";
import { privateMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...privateMetadata("Athlete Portal"),
  description: "Official PROTIPPZ Athlete Portal & Management",
};

export default function PlayerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <div className="min-h-[72vh] pb-24 sm:pb-28 lg:pb-12">{children}</div>
      <Footer />
    </>
  );
}
