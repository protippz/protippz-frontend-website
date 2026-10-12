import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { get, imageUrl } from "@/ApisRequests/server";
import TeamDetailsView, {
  TeamDetailsData,
} from "@/components/Teamz/TeamDetails/TeamDetailsView";
import { Player } from "@/app/(default)/playerz/page";
import GoToTop from "@/components/ui/GoToTop";
import { ArrowLeft, ShieldX } from "lucide-react";
import { extractLogoColor } from "@/lib/extractLogoColor";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function fetchTeam(
  id: string,
  token?: string | null
): Promise<TeamDetailsData | null> {
  try {
    const res = await get(`/team/get-single/${id}`, {
      headers: token ? { Authorization: token } : {},
    });
    if (res?.success && res?.data) {
      return res.data;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch team details:", error);
    return null;
  }
}

async function fetchTeamRoster(
  teamId: string,
  token?: string | null
): Promise<Player[]> {
  try {
    const res = await get(`/player/get-all?team=${teamId}&limit=50`, {
      headers: token ? { Authorization: token } : {},
    });
    if (res?.success && res?.data?.result) {
      return res.data.result;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch team roster:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (!id) {
    return {
      title: "Team Profile | PROTIPPZ",
      description: "Support collegiate teams and send digital tips with ProTippz.",
    };
  }

  const team = await fetchTeam(id);
  if (!team) {
    return {
      title: "Team Not Found | PROTIPPZ",
      description: "The requested athletic team profile could not be found.",
    };
  }

  const leagueName = team.league?.name || "NCAA";
  const title = `${team.name} - ${leagueName} Team Profile | PROTIPPZ`;
  const description = `Support ${team.name} with direct digital tips on ProTippz. View team roster, NIL community raised, and follow the program!`;
  const logoUrl = team.team_logo
    ? imageUrl(team.team_logo)
    : team.team_bg_image
    ? imageUrl(team.team_bg_image)
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: logoUrl ? [{ url: logoUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: logoUrl ? [logoUrl] : [],
    },
  };
}

export default async function TeamDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  const [team, roster] = await Promise.all([
    fetchTeam(id, token),
    fetchTeamRoster(id, token),
  ]);

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
          We couldn&apos;t locate the athletic program you requested. It may have
          been removed or the link is incorrect.
        </p>
        <Link
          href="/teamz"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#053697] hover:bg-[#042873] text-white font-bold text-sm transition-colors shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Teamz Directory</span>
        </Link>
      </div>
    );
  }

  // Extract primary vibrant brand color from team logo or league image
  const logoUrl = team.team_logo || team.team_bg_image || team.league?.league_image;
  const colorTheme = await extractLogoColor(logoUrl);

  return (
    <div className="min-h-screen bg-[#fafbfb] pb-16">
      <GoToTop />
      <TeamDetailsView
        team={team}
        roster={roster}
        token={token}
        colorTheme={colorTheme}
      />
    </div>
  );
}
