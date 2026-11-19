import type { Metadata } from "next";
import Navbar from "@/components/Shared/Client/Navbar";
import Footer from "@/components/Shared/Client/Footer";
import { privateMetadata } from "@/lib/seo";

// Account area: not indexed. Public pages in this group (contact, faqs)
// override this with their own `layout.tsx` metadata.
export const metadata: Metadata = privateMetadata();

export default function UsersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <div className="min-h-[72vh] flex flex-col justify-center items-center pb-16 lg:pb-0">
        {children}
      </div>
      <Footer />
    </>
  );
}
