import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sports News – Women's Sports, WNBA, NWSL, College & HBCU Headlines",
  description:
    "The latest headlines from women's college basketball, the WNBA, NWSL, HBCU football and tennis – curated for fans on PROTIPPZ.",
  path: "/sports-news",
});

export default function SportsNewsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
