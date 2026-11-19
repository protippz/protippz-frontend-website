import type { Metadata } from "next";
import Link from "next/link";
import PlayerDetailsView, {
  PlayerDetailsData,
} from "@/components/Playerz/PlayerDetailsView";
import JsonLd from "@/components/seo/JsonLd";
import { ArrowLeft, UserX } from "lucide-react";
import { extractLogoColor } from "@/lib/extractLogoColor";
import { getPlayerById } from "@/lib/api/queries";
import { getServerToken } from "@/lib/api/server";
import { buildMetadata, jsonLdAthlete, jsonLdBreadcrumbs, toPlainText } from "@/lib/seo";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const player = id ? await getPlayerById(id) : null;

  if (!player) {
    return buildMetadata({
      title: "Player Not Found",
      description: "The requested athlete profile could not be found.",
      noIndex: true,
    });
  }

  const teamName = player.team?.name || "Independent";
  const position = player.position ? ` (${player.position})` : "";
  const bio = toPlainText(player.bio, 110);
  const description = `Support ${player.name}${position} of ${teamName} with direct digital tips on PROTIPPZ.${bio ? ` ${bio}` : " View stats, team affiliation and join the tipping community."}`;

  return buildMetadata({
    title: `${player.name}${position} – ${teamName}`,
    description: toPlainText(description, 160),
    path: `/playerz/${player._id || id}`,
    image: player.player_image,
    imageAlt: player.name,
    type: "profile",
    keywords: [player.name, teamName, "tip athletes", "NIL tipping", "PROTIPPZ"],
  });
}

export default async function PlayerDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const [player, token] = await Promise.all([getPlayerById(id), getServerToken()]);

  if (!player) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <UserX className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          Player Profile Not Found
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto mb-6">
          We couldn&apos;t locate the athlete profile you requested. It may have
          been removed or the ID is incorrect.
        </p>
        <Link
          href="/playerz"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#053697] hover:bg-[#042873] text-white font-bold text-sm transition-colors "
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Playerz Directory</span>
        </Link>
      </div>
    );
  }

  // Extract primary brand color from team logo, league image, or player image
  const logoUrl =
    player.team?.team_logo ||
    player.league?.league_image ||
    player.player_image;
  const colorTheme = await extractLogoColor(logoUrl);

  return (
    <div className="min-h-screen bg-[#fafbfb] pb-16">
      <JsonLd
        data={[
          jsonLdAthlete(player),
          jsonLdBreadcrumbs([
            { name: "Home", path: "/" },
            { name: "Playerz", path: "/playerz" },
            { name: player.name, path: `/playerz/${player._id}` },
          ]),
        ]}
      />
      <PlayerDetailsView
        player={player as PlayerDetailsData}
        token={token ?? undefined}
        colorTheme={colorTheme}
      />
    </div>
  );
}
