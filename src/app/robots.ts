import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/api/config";

/** Account, payment and auth areas – never useful in search results. */
const PRIVATE_PATHS = [
  "/api/",
  // fan account
  "/profile",
  "/settings",
  "/notification",
  "/favorites",
  "/invite-friends",
  "/send-tip",
  "/deposit",
  "/withdraw",
  "/payment/",
  "/tippz-history",
  "/transaction-log",
  "/rewardz",
  // athlete / team portals
  "/home",
  "/address",
  "/tax-information",
  "/my-tip-history",
  "/my-withdraw-history",
  "/player-transaction-log",
  "/player-withdraw",
  "/team-home",
  // auth & transactional
  "/change-password",
  "/otp",
  "/forget-otp",
  "/forget-password",
  "/reset-password",
  "/success",
  "/deposit-success",
  "/account-created",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: PRIVATE_PATHS }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
