import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { get } from "@/ApisRequests/server";
import PlayerDetailsView, {
  PlayerDetailsData,
} from "@/components/Playerz/PlayerDetailsView";
import GoToTop from "@/components/ui/GoToTop";
import { ArrowLeft, UserX } from "lucide-react";
import { extractLogoColor } from "@/lib/extractLogoColor";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function fetchPlayer(id: string, token?: string | null): Promise<PlayerDetailsData | null> {
  try {
    const res = await get(`/player/get-single/${id}`, {
      headers: token ? { Authorization: token } : {},
    });
    if (res?.success && res?.data) {
      return res.data;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch player details:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (!id) {
    return {
      title: "Player Profile | PROTIPPZ",
      description: "Support athletes and send digital tips with ProTippz.",
    };
  }

  const player = await fetchPlayer(id);
  if (!player) {
    return {
      title: "Player Not Found | PROTIPPZ",
      description: "The requested athlete profile could not be found.",
    };
  }

  const teamName = player.team?.name || "Independent";
  const position = player.position ? ` (${player.position})` : "";
  const title = `${player.name}${position} - ${teamName} | PROTIPPZ`;
  const description = `Support ${player.name} with direct digital tips on ProTippz. View athletic stats, team affiliation, and join the tipping community!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: player.player_image ? [{ url: player.player_image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: player.player_image ? [player.player_image] : [],
    },
  };
}

export default async function PlayerDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  const player = await fetchPlayer(id, token);

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
          We couldn&apos;t locate the athlete profile you requested. It may have been
          removed or the ID is incorrect.
        </p>
        <Link
          href="/playerz"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#053697] hover:bg-[#042873] text-white font-bold text-sm transition-colors shadow-md"
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
      <GoToTop />
      <PlayerDetailsView player={player} token={token} colorTheme={colorTheme} />
    </div>
  );
}
