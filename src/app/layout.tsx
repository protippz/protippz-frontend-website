import GoogleAnalytics from "@/components/GoogleAnalytics/GoogleAnalytics";
import SportsTicker from "@/components/Shared/SportsTicker";
import ClickjackingFixed from "@/components/ethical_process/ClickjackingFixed";
import { AuthProvider } from "@/provider/ContextProvider";
import type { Metadata } from "next";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
export const metadata: Metadata = {
  title: "PROTIPPZ",
  description: "protippz",
  keywords: "protippz",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    type: "website",
    url: "https://protippz.com",
    title: "PROTIPPZ",
    description: "protippz",
    images: [
      {
        url: "https://i.ibb.co.com/cXf1gL5/image-1.png",
        width: 1200,
        height: 630,
        alt: "Protippz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PROTIPPZ",
    description: "protippz",
    images: ["https://i.ibb.co.com/cXf1gL5/image-1.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" type="image/png" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>
        <NextTopLoader />
        <AuthProvider>
          <Script
            id="chatbot-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function () {
              var d = document;
              var s = d.createElement("script");
              s.src = "${process.env.NEXT_PUBLIC_CHATBOT_SCRIPT || "https://webagent.ai/api/chatbot/4f7a153a-a52c-4712-b58c-994a93bd04bb"}";
              s.async = 1;
              (d.getElementsByTagName("head")[0] || d.documentElement).appendChild(s);
            })();`,
            }}
          />
          <ClickjackingFixed>{children}</ClickjackingFixed>
          <SportsTicker />
        </AuthProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
