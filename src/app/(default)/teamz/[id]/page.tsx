import type { Metadata } from "next";
import Link from "next/link";
import TeamDetailsView, {
  TeamDetailsData,
} from "@/components/Teamz/TeamDetails/TeamDetailsView";
import type { Player } from "@/app/(default)/playerz/page";
import JsonLd from "@/components/seo/JsonLd";
import { ArrowLeft, ShieldX } from "lucide-react";
import { extractLogoColor } from "@/lib/extractLogoColor";
import { getPlayers, getTeamById } from "@/lib/api/queries";
import { getServerToken } from "@/lib/api/server";
import { buildMetadata, jsonLdBreadcrumbs, jsonLdSportsTeam, toPlainText } from "@/lib/seo";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const team = id ? await getTeamById(id) : null;

  if (!team) {
    return buildMetadata({
      title: "Team Not Found",
      description: "The requested athletic team profile could not be found.",
      noIndex: true,
    });
  }

  const leagueName = team.league?.name || "NCAA";
  const about = toPlainText(team.description, 90);
  const description = `Support ${team.name} (${leagueName}) with direct digital tips on PROTIPPZ.${about ? ` ${about}` : " View the team roster and follow the program."}`;

  return buildMetadata({
    title: `${team.name} – ${leagueName} Team Profile`,
    description: toPlainText(description, 160),
    path: `/teamz/${team._id || id}`,
    image: team.team_logo,
    imageAlt: `${team.name} logo`,
    keywords: [team.name, leagueName, "support teams", "sports tipping", "PROTIPPZ"],
  });
}

export default async function TeamDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const [team, rosterRes, token] = await Promise.all([
    getTeamById(id),
    getPlayers({ team: id, limit: 50 }),
    getServerToken(),
  ]);
  const roster = rosterRes.result as Player[];

  if (!team) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <ShieldX className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          Team Profile Not Found
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto mb-6">
          We couldn&apos;t locate the athletic program you requested. It may
          have been removed or the link is incorrect.
        </p>
        <Link
          href="/teamz"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#053697] hover:bg-[#042873] text-white font-bold text-sm transition-colors "
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Teamz Directory</span>
        </Link>
      </div>
    );
  }

  // Extract primary vibrant brand color from team logo or league image
  const logoUrl = team.team_logo || team.league?.league_image;
  const colorTheme = await extractLogoColor(logoUrl);

  return (
    <div className="min-h-screen bg-[#fafbfb] pb-16">
      <JsonLd
        data={[
          jsonLdSportsTeam(team),
          jsonLdBreadcrumbs([
            { name: "Home", path: "/" },
            { name: "Teamz", path: "/teamz" },
            { name: team.name, path: `/teamz/${team._id}` },
          ]),
        ]}
      />
      <TeamDetailsView
        team={team as TeamDetailsData}
        roster={roster}
        token={token ?? undefined}
        colorTheme={colorTheme}
      />
    </div>
  );
}
