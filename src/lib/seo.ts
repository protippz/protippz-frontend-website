import type { Metadata } from "next";
import { imageUrl, SITE_URL, siteUrl } from "@/lib/api/config";

/**
 * SEO helpers shared by every route.
 * Use `buildMetadata()` in `export const metadata` / `generateMetadata`
 * and the `jsonLd*` builders with `<JsonLd />` for structured data.
 */

export const SITE_NAME = "PROTIPPZ";
export const SITE_TAGLINE = "Sports Fan Engagement Platform & NIL Tipping";
export const DEFAULT_TITLE = `${SITE_NAME} | ${SITE_TAGLINE}`;
export const DEFAULT_DESCRIPTION =
  "PROTIPPZ lets sports fans send digital tips to their favorite athletes and teams, support college athletes through NIL, earn rewards and join a passionate sports community.";

/** Same-origin default share image (1200×630). */
export const DEFAULT_OG_IMAGE = "/og-image.png";

export const DEFAULT_KEYWORDS = [
  "PROTIPPZ",
  "sports tipping",
  "tip athletes",
  "NIL tipping",
  "best NIL deals",
  "NIL deals for college athletes",
  "support athletes",
  "sports fan engagement",
  "fan engagement platform",
  "fan appreciation",
  "college sports",
  "women's sports",
  "gender pay gap in sports",
  "sports community",
];

export const SOCIAL_PROFILES: string[] = [
  // Add official profile URLs here; they are emitted as Organization.sameAs.
];

export interface BuildMetadataInput {
  /** Page title without the brand suffix (the root template adds it). */
  title?: string;
  description?: string;
  /** Route path, e.g. "/playerz". Used for the canonical URL. */
  path?: string;
  /** Absolute or backend-relative image URL. */
  image?: string | null;
  imageAlt?: string;
  keywords?: string[];
  type?: "website" | "article" | "profile";
  /** Mark private / thin pages as noindex. */
  noIndex?: boolean;
  /** Use the title verbatim (skip the "| PROTIPPZ" template). */
  absoluteTitle?: boolean;
}

/**
 * Social platforms (Facebook, LinkedIn, X) reject or downgrade plain-http images.
 * The backend stores some CloudFront URLs as http:// although HTTPS is served.
 */
const preferHttps = (url: string) =>
  /^http:\/\/[a-z0-9-]+\.cloudfront\.net\//i.test(url) ? url.replace(/^http:/i, "https:") : url;

const resolveImage = (image?: string | null) => {
  if (!image) return DEFAULT_OG_IMAGE;
  if (image.startsWith("/") && !image.startsWith("//")) {
    // Site-relative asset (e.g. /og-image.png) stays relative to metadataBase;
    // anything else relative is a backend upload path.
    return image === DEFAULT_OG_IMAGE ? image : imageUrl(image);
  }
  return preferHttps(imageUrl(image));
};

/** Strips HTML and collapses whitespace – for building descriptions from rich text. */
export const toPlainText = (html?: string | null, max = 160): string => {
  if (!html) return "";
  const text = html
    .replace(/<[^>]*>?/gm, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
};

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image,
  imageAlt,
  keywords,
  type = "website",
  noIndex = false,
  absoluteTitle = false,
}: BuildMetadataInput = {}): Metadata {
  const ogImage = resolveImage(image);
  const fullTitle = title ? (absoluteTitle ? title : `${title} | ${SITE_NAME}`) : DEFAULT_TITLE;
  const url = path ? siteUrl(path) : undefined;

  return {
    title: title ? (absoluteTitle ? { absolute: title } : title) : { absolute: DEFAULT_TITLE },
    description,
    keywords: keywords ?? DEFAULT_KEYWORDS,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: "en_US",
      title: fullTitle,
      description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: imageAlt || fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : undefined,
  };
}

/** Metadata for authenticated / transactional areas that must never be indexed. */
export const privateMetadata = (title?: string): Metadata => ({
  // Object form keeps the "%s | PROTIPPZ" template alive for child pages
  // (a plain string title in a layout would reset it).
  ...(title ? { title: { default: title, template: `%s | ${SITE_NAME}` } } : {}),
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
});

// ---- JSON-LD builders ---------------------------------------------------------

type JsonLdObject = Record<string, unknown>;

export const jsonLdOrganization = (): JsonLdObject => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: siteUrl("/new/logo.png"),
  description: DEFAULT_DESCRIPTION,
  ...(SOCIAL_PROFILES.length ? { sameAs: SOCIAL_PROFILES } : {}),
});

export const jsonLdWebsite = (): JsonLdObject => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  inLanguage: "en-US",
  publisher: { "@id": `${SITE_URL}/#organization` },
});

export const jsonLdBreadcrumbs = (items: { name: string; path: string }[]): JsonLdObject => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: siteUrl(item.path),
  })),
});

export const jsonLdAthlete = (player: {
  _id: string;
  name: string;
  position?: string;
  bio?: string;
  player_image?: string;
  team?: { _id?: string; name?: string } | null;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
}): JsonLdObject => {
  const sameAs = [player.instagram, player.twitter, player.tiktok].filter(
    (v): v is string => typeof v === "string" && /^https?:\/\//i.test(v),
  );
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: siteUrl(`/playerz/${player._id}`),
    mainEntity: {
      "@type": "Person",
      name: player.name,
      ...(player.position ? { jobTitle: player.position } : {}),
      ...(player.bio ? { description: toPlainText(player.bio, 300) } : {}),
      ...(player.player_image ? { image: imageUrl(player.player_image) } : {}),
      ...(player.team?.name
        ? {
            memberOf: {
              "@type": "SportsTeam",
              name: player.team.name,
              ...(player.team._id ? { url: siteUrl(`/teamz/${player.team._id}`) } : {}),
            },
          }
        : {}),
      ...(sameAs.length ? { sameAs } : {}),
    },
  };
};

export const jsonLdSportsTeam = (team: {
  _id: string;
  name: string;
  sport?: string;
  description?: string;
  team_logo?: string;
  league?: { name?: string } | null;
}): JsonLdObject => ({
  "@context": "https://schema.org",
  "@type": "SportsTeam",
  name: team.name,
  url: siteUrl(`/teamz/${team._id}`),
  ...(team.sport ? { sport: team.sport } : {}),
  ...(team.description ? { description: toPlainText(team.description, 300) } : {}),
  ...(team.team_logo ? { logo: imageUrl(team.team_logo) } : {}),
  ...(team.league?.name ? { memberOf: { "@type": "SportsOrganization", name: team.league.name } } : {}),
});

export const jsonLdFaq = (faqs: { question: string; answer: string }[]): JsonLdObject => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: toPlainText(faq.question, 300),
    acceptedAnswer: { "@type": "Answer", text: toPlainText(faq.answer, 1000) },
  })),
});
