import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Community – Sports News, Athlete Stories & Fan Discussions",
  description:
    "Join the PROTIPPZ community: follow athlete stories, sports news and fan discussions, and support your favorite players and teams with tips.",
  path: "/community",
});

export default function CommunityLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
