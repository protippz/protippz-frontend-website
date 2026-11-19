import Navbar from "@/components/Shared/Client/Navbar";
import Footer from "@/components/Shared/Client/Footer";
import SportsTicker from "@/components/Shared/SportsTicker";

/**
 * Public marketing / directory pages.
 * Metadata is defined per page (see `buildMetadata` in `src/lib/seo.ts`).
 * Auth, Redux and the top loader are provided once by the root layout.
 */
export default function DefaultLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <div className="min-h-[72vh] pb-32 sm:pb-36 lg:pb-16">{children}</div>
      <Footer />
      <SportsTicker />
    </>
  );
}
