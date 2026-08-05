import type { Metadata } from "next";
import Navbar from "@/components/Shared/Client/Navbar";
import Footer from "@/components/Shared/Client/Footer";
import { AuthProvider } from "@/provider/ContextProvider";
import NextTopLoader from "nextjs-toploader";
import ShocaseMarquee from "@/components/HomePage/ShocaseMarquee";
import Head from "next/head";

export const metadata: Metadata = {
  title: "PROTIPPZ",
  keywords: "protippz",
  description: "protippz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Head>
        <meta name="description" content="protippz" />
        <meta name="keywords" content="protippz" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="PROTIPPZ" />
        <meta property="og:description" content="protippz" />
        <meta
          property="og:image"
          content="https://protippz.com/assets/seo-banner.jpg"
        />
        <meta property="og:url" content="https://protippz.com" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PROTIPPZ" />
        <meta
          name="twitter:description"
          content="Join a passionate sports tipping community, earn rewards, and win prizes. Start tipping today!"
        />
        <meta
          name="twitter:image"
          content="https://protippz.com/assets/seo-banner.jpg"
        />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Website",
            name: "PROTIPPZ - Best Sports Tipping Platform",
            url: "https://protippz.com",
            description: "protippz",
            image: "https://protippz.com/assets/seo-banner.jpg",
            publisher: {
              "@type": "Organization",
              name: "ProTippz",
              logo: "https://protippz.com/assets/logo.png",
            },
            potentialAction: {
              "@type": "SearchAction",
              target: "https://protippz.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          })}
        </script>
      </Head>
      <ShocaseMarquee />
      <NextTopLoader />
      <AuthProvider>
        <Navbar />
        <div className="min-h-[72vh] flex flex-col justify-center items-center">
          {children}
        </div>
        <Footer />
      </AuthProvider>
    </>
  );
}
