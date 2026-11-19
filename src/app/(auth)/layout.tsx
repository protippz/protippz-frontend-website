import type { Metadata } from "next";
import { privateMetadata } from "@/lib/seo";

// Auth flows are not useful search results; keep them out of the index.
export const metadata: Metadata = privateMetadata("Account");

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
