import type { Metadata } from 'next';
import Navbar from '@/components/Shared/Client/Navbar';
import Footer from '@/components/Shared/Client/Footer';
import { AuthProvider } from '@/provider/ContextProvider';
import NextTopLoader from 'nextjs-toploader';
import Head from 'next/head';
import { getSEOMetadata } from '@/components/seo/seo';
import SeoPage from '@/components/seo/SeoPage';

export const metadata: Metadata = {
  title: 'PROTIPPZ',
  description: 'protippz',
  icons: {
    icon: '../favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const seoMetadata = getSEOMetadata('home');
  return (
    <>
      <h1 className="hidden">
        PROTIPPZ | Sports Fan Engagement Platform & NIL Deals
      </h1>
      <p className="hidden">
        Join PROTIPPZ sports community for sports tipping, fan engagement, and
        the best NIL deals for college athletes.
      </p>
      <span className="hidden">sports tipping</span>
      <span className="hidden">sports fans</span>
      <span className="hidden">best nil deals</span>
      <span className="hidden">sports fan engagement</span>
      <span className="hidden">gender pay gap in sports</span>
      <span className="hidden">college sports</span>
      <span className="hidden">support athletes</span>
      <span className="hidden">sports community</span>
      <span className="hidden">fan engagement platform</span>
      <span className="hidden">fan appreciation</span>
      <span className="hidden">nil deals for college athletes</span>
      <span className="hidden">nil tipping</span>
      <h2 className="hidden">Welcome to the PROTIPPZ Sports Community</h2>
      <p className="hidden">
        Join our platform for sports tipping, fan engagement, and the best NIL
        deals for college athletes.
      </p>
      <h3 className="hidden">Sports Fan Engagement</h3>
      <p className="hidden">
        Connect with your favorite athletes and teams in our vibrant sports
        community.
      </p>
      <h3 className="hidden">NIL Deals for College Athletes</h3>
      <p className="hidden">
        Discover and support the best NIL deals that help college sports stars
        thrive.
      </p>
      <h3 className="hidden">Support Athletes</h3>
      <p className="hidden">
        Show your fan appreciation through our innovative tipping platform.
      </p>
      <h1 className="hidden">
        PROTIPPZ | Sports Fan Engagement Platform & NIL Deals
      </h1>
      <Head>
        <meta name="description" content="protippz" />
        <meta name="keywords" content="protippz" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="PROTIPPZ" />
        <meta property="og:description" content="protippz" />

        <meta property="og:url" content="https://protippz.com" />
        <meta name="twitter:title" content="PROTIPPZ" />
        <meta
          name="twitter:description"
          content="Join a passionate sports tipping community, earn rewards, and win prizes. Start tipping today!"
        />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Website',
            name: 'PROTIPPZ',
            url: 'https://protippz.com',
            description: 'protippz',

            publisher: {
              '@type': 'Organization',
              name: 'PROTIPPZ',
            },
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://protippz.com/search?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          })}
        </script>
      </Head>
      <SeoPage metadata={seoMetadata} />
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
