// "use client";
// import PoweredByStripe from "@/components/ad/PoweredByStripe";
// import Banner from "@/components/HomePage/Banner";
// import DownloadSection from "@/components/HomePage/DownloadSection";
// import AnnouncementPopups from "@/components/popups/AnnouncementPopups";
// import { getSEOMetadata } from "@/components/seo/seo";
// import SeoPage from "@/components/seo/SeoPage";
// import dynamic from "next/dynamic";

// // const AdContainer = dynamic(() => import('@/components/ad/AdContainer'), {
// //   ssr: false,
// // });
// // new

// export default function Home() {
//   const seoMetadata = getSEOMetadata("home");
//   return (
//     <>
//       <div>
//         <h1 className="hidden">
//           PROTIPPZ | Sports Fan Engagement Platform & NIL Deals
//         </h1>
//         <p className="hidden">
//           Join PROTIPPZ sports community for sports tipping, fan engagement, and
//           the best NIL deals for college athletes.
//         </p>
//         <span className="hidden">sports tipping</span>
//         <span className="hidden">sports fans</span>
//         <span className="hidden">best nil deals</span>
//         <span className="hidden">sports fan engagement</span>
//         <span className="hidden">gender pay gap in sports</span>
//         <span className="hidden">college sports</span>
//         <span className="hidden">support athletes</span>
//         <span className="hidden">sports community</span>
//         <span className="hidden">fan engagement platform</span>
//         <span className="hidden">fan appreciation</span>
//         <span className="hidden">nil deals for college athletes</span>
//         <span className="hidden">nil tipping</span>
//         <h2 className="hidden">Welcome to the PROTIPPZ Sports Community</h2>
//         <p className="hidden">
//           Join our platform for sports tipping, fan engagement, and the best NIL
//           deals for college athletes.
//         </p>
//         <h3 className="hidden">Sports Fan Engagement</h3>
//         <p className="hidden">
//           Connect with your favorite athletes and teams in our vibrant sports
//           community.
//         </p>
//         <h3 className="hidden">NIL Deals for College Athletes</h3>
//         <p className="hidden">
//           Discover and support the best NIL deals that help college sports stars
//           thrive.
//         </p>
//         <h3 className="hidden">Support Athletes</h3>
//         <p className="hidden">
//           Show your fan appreciation through our innovative tipping platform.
//         </p>
//         <h1 className="hidden">
//           PROTIPPZ | Sports Fan Engagement Platform & NIL Deals
//         </h1>
//       </div>
//       <SeoPage metadata={seoMetadata} />
//       <Banner />
//       {/* <AdContainer /> */}
//       <PoweredByStripe />
//       <DownloadSection />
//       <AnnouncementPopups />
//     </>
//   );
// }

"use client";
import PoweredByStripe from "@/components/ad/PoweredByStripe";
import Banner from "@/components/HomePage/Banner";
import BrandShowcase from "@/components/HomePage/BrandShowcase";
import ConnectionBoth from "@/components/HomePage/ConnectionBoth";
import DownloadSection from "@/components/HomePage/DownloadSection";
import FAQ from "@/components/HomePage/FAQ";
import ForAthletes from "@/components/HomePage/ForAthlets";
import HeroSection from "@/components/HomePage/HeroSection";
import HowItWork from "@/components/HomePage/HowItWork";
import Testimonials from "@/components/HomePage/Testimonials";
import TopHero from "@/components/HomePage/TopHero";
import WhyProtippzExist from "@/components/HomePage/WhyProtippzExist";
import AnnouncementPopups from "@/components/popups/AnnouncementPopups";
import { getSEOMetadata } from "@/components/seo/seo";
import SeoPage from "@/components/seo/SeoPage";
import dynamic from "next/dynamic";

// const AdContainer = dynamic(() => import('@/components/ad/AdContainer'), {
//   ssr: false,
// });

export default function Home() {
  const seoMetadata = getSEOMetadata("home");
  return (
    <>
      {/* <div>
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
      </div> */}
      <SeoPage metadata={seoMetadata} />
      {/* <Banner /> */}
      <HeroSection />
      <BrandShowcase />
      <WhyProtippzExist />
      <HowItWork />
      <TopHero />
      <ForAthletes />
      <ConnectionBoth />
      <Testimonials />
      <FAQ />
      {/* <PoweredByStripe /> */}
      {/* <DownloadSection />
      <AnnouncementPopups /> */}
    </>
  );
}
