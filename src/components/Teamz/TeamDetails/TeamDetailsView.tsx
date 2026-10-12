"use client";

import React, { useState, useEffect } from "react";
import { imageUrl } from "@/ApisRequests/server";
import { FastAverageColor } from "fast-average-color";
import { ExtractedColorTheme } from "@/lib/extractLogoColor";
import { Player } from "@/app/(default)/playerz/page";
import TeamBreadcrumbNav from "./TeamBreadcrumbNav";
import TeamHeroBanner from "./TeamHeroBanner";
import TeamRosterSection from "./TeamRosterSection";
import TeamAboutCard from "./TeamAboutCard";
import TeamLeagueCard from "./TeamLeagueCard";
import TeamTipCard from "./TeamTipCard";

export interface TeamDetailsData {
  _id: string;
  name: string;
  team_logo?: string;
  team_bg_image?: string;
  sport?: string;
  league?: {
    _id: string;
    name: string;
    sport?: string;
    league_image?: string;
  };
  totalTips?: number;
  paidAmount?: number;
  dueAmount?: number;
  isBookmark?: boolean;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TeamDetailsViewProps {
  team: TeamDetailsData;
  roster: Player[];
  token?: string | null;
  colorTheme?: ExtractedColorTheme;
}

const DEFAULT_COLOR_THEME: ExtractedColorTheme = {
  primary: "#053697",
  dark: "#032469",
  darker: "#021744",
  accent: "#2FC191",
};

const TeamDetailsView: React.FC<TeamDetailsViewProps> = ({
  team,
  roster,
  token,
  colorTheme = DEFAULT_COLOR_THEME,
}) => {
  const [theme, setTheme] = useState<ExtractedColorTheme>(colorTheme);

  useEffect(() => {
    if (colorTheme && colorTheme.primary !== DEFAULT_COLOR_THEME.primary) {
      setTheme(colorTheme);
      return;
    }

    const logo =
      team.team_logo || team.team_bg_image || team.league?.league_image;
    if (!logo) return;

    try {
      const fac = new FastAverageColor();
      const proxiedUrl = `/_next/image?url=${encodeURIComponent(
        imageUrl(logo)
      )}&w=64&q=75`;
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
              accent: "#2FC191",
            });
          }
        } catch (e) {
          // ignore
        }
      };
    } catch (e) {
      // ignore
    }
  }, [team, colorTheme]);

  return (
    <div className="w-full space-y-6">
      {/* 1. Breadcrumbs & Return Bar */}
      <TeamBreadcrumbNav teamName={team.name} />

      {/* 2. Brand Hero Banner */}
      <TeamHeroBanner
        team={team}
        token={token}
        theme={theme}
        rosterCount={roster.length}
      />

      {/* 3. Main Details, Roster & Tipping Section */}
      <div className="max-w-355 mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 space-y-6">
        <div className="grid grid-cols-1 gap-6 items-start">
          {/* Left Column (2 Cols): Roster, About & League Info */}
          <div className="space-y-6">
            {/* Team Roster with Search */}
            <TeamRosterSection
              roster={roster}
              teamName={team.name}
              token={token}
              accentColor={theme.primary}
            />

            {/* About and League Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TeamAboutCard team={team} />
              <TeamLeagueCard team={team} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetailsView;
