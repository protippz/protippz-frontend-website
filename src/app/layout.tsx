import type { Metadata, Viewport } from "next";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import GoogleAnalytics from "@/components/GoogleAnalytics/GoogleAnalytics";
import ClickjackingFixed from "@/components/ethical_process/ClickjackingFixed";
import JsonLd from "@/components/seo/JsonLd";
import { AuthProvider } from "@/provider/ContextProvider";
import ReduxProvider from "@/provider/ReduxProvider";
import { SITE_URL } from "@/lib/api/config";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
  jsonLdOrganization,
  jsonLdWebsite,
} from "@/lib/seo";
import "./globals.css";

const CHATBOT_SCRIPT_URL =
  process.env.NEXT_PUBLIC_CHATBOT_SCRIPT ||
  "https://webagent.ai/api/chatbot/4f7a153a-a52c-4712-b58c-994a93bd04bb";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "sports",
  // NOTE: no `alternates.canonical` here – it would cascade to every page.
  // Each public page sets its own canonical via `buildMetadata({ path })`.
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    apple: [{ url: "/new/logo.png" }],
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={[jsonLdOrganization(), jsonLdWebsite()]} />
        <ReduxProvider>
          <Script
            id="onesignal-sdk-script"
            src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
            strategy="afterInteractive"
          />
          <NextTopLoader />
          <AuthProvider>
            <Script id="chatbot-script" src={CHATBOT_SCRIPT_URL} strategy="lazyOnload" />
            <ClickjackingFixed>{children}</ClickjackingFixed>
          </AuthProvider>
          <GoogleAnalytics />
        </ReduxProvider>
      </body>
    </html>
  );
}
