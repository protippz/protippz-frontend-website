import type { MetadataRoute } from "next";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} – Sports Fan Engagement & NIL Tipping`,
    short_name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#fafbfb",
    theme_color: "#053697",
    icons: [{ src: "/favicon.ico", sizes: "32x32", type: "image/x-icon" }],
  };
}
