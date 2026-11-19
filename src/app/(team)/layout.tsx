import type { Metadata } from "next";
import { privateMetadata } from "@/lib/seo";

export const metadata: Metadata = privateMetadata("Team Portal");

export default function TeamLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
