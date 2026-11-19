import Script from "next/script";

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;
const isValidId = (id?: string): id is string => !!id && /^[A-Z0-9-]+$/i.test(id);

/**
 * Google Analytics 4 (gtag.js).
 * Previously the tag was configured twice (inline script + a useEffect that pushed
 * arrays instead of `arguments`), which double-counted the first page view.
 */
export default function GoogleAnalytics() {
  if (!isValidId(GA_TRACKING_ID)) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_TRACKING_ID}');`}
      </Script>
    </>
  );
}
