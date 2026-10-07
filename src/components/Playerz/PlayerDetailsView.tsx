"use client";

import React, { useState, useEffect } from "react";
import { imageUrl } from "@/ApisRequests/server";
import { FastAverageColor } from "fast-average-color";
import { ExtractedColorTheme } from "@/lib/extractLogoColor";
import PlayerLastGamesTable from "./PlayerLastGamesTable";
import PlayerBreadcrumbNav from "./PlayerDetails/PlayerBreadcrumbNav";
import PlayerHeroBanner from "./PlayerDetails/PlayerHeroBanner";
import PlayerAboutCard from "./PlayerDetails/PlayerAboutCard";
import PlayerTeamLeagueCards from "./PlayerDetails/PlayerTeamLeagueCards";
import PlayerTipCard from "./PlayerDetails/PlayerTipCard";

export interface PlayerDetailsData {
  _id: string;
  name: string;
  position?: string;
  jerceyNumber?: string | number;
  experience?: string;
  player_image?: string;
  player_bg_image?: string;
  totalTips?: number;
  paidAmount?: number;
  dueAmount?: number;
  isBookmark?: boolean;
  isStripeConnected?: boolean;
  email?: string;
  team?: {
    _id: string;
    name: string;
    email?: string;
    team_logo?: string;
    team_bg_image?: string;
  };
  league?: {
    _id: string;
    name: string;
    league_image?: string;
    sport?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface PlayerDetailsViewProps {
  player: PlayerDetailsData;
  token?: string | null;
  colorTheme?: ExtractedColorTheme;
}

const DEFAULT_COLOR_THEME: ExtractedColorTheme = {
  primary: "#053697",
  dark: "#032469",
  darker: "#021744",
  accent: "#f59e0b",
};

const PlayerDetailsView: React.FC<PlayerDetailsViewProps> = ({
  player,
  token,
  colorTheme = DEFAULT_COLOR_THEME,
}) => {
  const [theme, setTheme] = useState<ExtractedColorTheme>(colorTheme);

  // Client-side fallback extraction in case server theme was default and client has the logo
  useEffect(() => {
    if (colorTheme && colorTheme.primary !== DEFAULT_COLOR_THEME.primary) {
      setTheme(colorTheme);
      return;
    }

    const logo =
      player.team?.team_logo ||
      player.league?.league_image ||
      player.player_image;

    if (!logo) return;

    try {
      const fac = new FastAverageColor();
      const proxiedUrl = `/_next/image?url=${encodeURIComponent(imageUrl(logo))}&w=64&q=75`;
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = proxiedUrl;

      img.onload = () => {
        try {
          const color = fac.getColor(img, { algorithm: "dominant" });
          if (color && color.hex) {
            setTheme({
              primary: color.hex,
              dark: color.isDark ? color.hex : "#032469",
              darker: "#0a0a0a",
              accent: "#f59e0b",
            });
          }
        } catch (e) {
          // ignore
        }
      };
    } catch (e) {
      // ignore
    }
  }, [player, colorTheme]);

  const sportName = player?.league?.sport || "Basketball";
  const teamName = player?.team?.name || "Independent";
  const teamLogoUrl = player?.team?.team_logo
    ? imageUrl(player.team.team_logo)
    : "";

  // Map compact player object to Player interface expected by SendTipsButton
  const playerItemForTipping: any = {
    _id: player._id,
    name: player.name,
    league: player.league,
    team: player.team,
    position: player.position || "",
    player_image: player.player_image || "",
    jerceyNumber: String(player.jerceyNumber || ""),
    experience: player.experience || "",
    player_bg_image: player.player_bg_image || "",
    totalTips: player.totalTips || 0,
    paidAmount: player.paidAmount || 0,
    dueAmount: player.dueAmount || 0,
    isBookmark: !!player.isBookmark,
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Top Breadcrumb & Return Bar */}
      <PlayerBreadcrumbNav playerName={player.name} />

      {/* 2. NBA-Style Hero Banner with Dynamic Logo Color */}
      <PlayerHeroBanner
        player={player}
        token={token}
        theme={theme}
        playerItemForTipping={playerItemForTipping}
      />

      {/* 3. Main Details & Stats Section */}
      <div className="max-w-355 mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 space-y-6">
        {/* Last 5 Games Box Score Table */}
        <PlayerLastGamesTable
          teamName={teamName}
          position={player.position}
          accentColor={theme.primary}
        />

        {/* 2-Column Info & Tipping Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Athlete Story & Affiliations */}
          <div className="lg:col-span-2 space-y-6">
            <PlayerAboutCard player={player} teamName={teamName} />
            <PlayerTeamLeagueCards
              player={player}
              teamName={teamName}
              sportName={sportName}
              teamLogoUrl={teamLogoUrl}
            />
          </div>

          {/* Right: Direct Tipping Card */}
          <div className="space-y-6">
            <PlayerTipCard
              player={player}
              token={token}
              theme={theme}
              playerItemForTipping={playerItemForTipping}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailsView;

