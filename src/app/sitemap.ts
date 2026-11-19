import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/api/config";
import { serverFetch } from "@/lib/api/server";
import type { Paginated } from "@/types/api";
import type { Player, Team } from "@/types/models";
import type { CommunityPostBackendItem } from "@/types/community";

// Regenerate at most once per hour.
export const revalidate = 3600;

const PAGE_SIZE = 100;
const MAX_PAGES = 50; // hard cap: 5,000 URLs per entity type

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/playerz", priority: 0.9, changeFrequency: "daily" },
  { path: "/teamz", priority: 0.9, changeFrequency: "daily" },
  { path: "/community", priority: 0.8, changeFrequency: "daily" },
  { path: "/tippz", priority: 0.8, changeFrequency: "monthly" },
  { path: "/sports-news", priority: 0.7, changeFrequency: "daily" },
  { path: "/prottiz-special", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faqs", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
  { path: "/sign-up", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/delete-account", priority: 0.1, changeFrequency: "yearly" },
];

/** Walks a paginated public list endpoint (unauthenticated, cached). */
async function fetchAll<T>(path: string): Promise<T[]> {
  const items: T[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await serverFetch<Paginated<T>>(path, {
      auth: false,
      revalidate,
      params: { page, limit: PAGE_SIZE },
    });
    const batch = res.data?.result ?? [];
    items.push(...batch);
    const totalPage = res.data?.meta?.totalPage ?? 1;
    if (!res.success || batch.length === 0 || page >= totalPage) break;
  }
  return items;
}

const lastModified = (value?: string) => {
  const date = value ? new Date(value) : undefined;
  return date && !Number.isNaN(date.getTime()) ? date : undefined;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: siteUrl(r.path),
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const [players, teams, posts] = await Promise.all([
    fetchAll<Player>("/player/get-all"),
    fetchAll<Team>("/team/get-all"),
    fetchAll<CommunityPostBackendItem>("/community-post/get-all"),
  ]);

  const playerEntries: MetadataRoute.Sitemap = players
    .filter((p) => p?._id)
    .map((p) => ({
      url: siteUrl(`/playerz/${p._id}`),
      lastModified: lastModified(p.updatedAt),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const teamEntries: MetadataRoute.Sitemap = teams
    .filter((t) => t?._id)
    .map((t) => ({
      url: siteUrl(`/teamz/${t._id}`),
      lastModified: lastModified(t.updatedAt),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const postEntries: MetadataRoute.Sitemap = posts
    .filter((p) => p?._id)
    .map((p) => ({
      url: siteUrl(`/community/post/${encodeURIComponent(p.slug || p._id)}`),
      lastModified: lastModified(p.updatedAt || p.createdAt),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [...staticEntries, ...playerEntries, ...teamEntries, ...postEntries];
}
