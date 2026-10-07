import sharp from "sharp";

export interface ExtractedColorTheme {
  primary: string;
  dark: string;
  darker: string;
  accent: string;
}

const DEFAULT_THEME: ExtractedColorTheme = {
  primary: "#053697",
  dark: "#032469",
  darker: "#021744",
  accent: "#f59e0b",
};

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) =>
        Math.min(255, Math.max(0, Math.round(x)))
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}

function adjustBrightness(
  r: number,
  g: number,
  b: number,
  factor: number
): [number, number, number] {
  return [
    Math.round(r * factor),
    Math.round(g * factor),
    Math.round(b * factor),
  ];
}

/**
 * Extracts the dominant vibrant color from a team/league logo image on the server.
 * Returns primary, dark (for borders/sub-headers), and darker (for stats ribbon) colors.
 */
export async function extractLogoColor(
  logoUrl?: string | null
): Promise<ExtractedColorTheme> {
  if (!logoUrl || typeof logoUrl !== "string") {
    return DEFAULT_THEME;
  }

  try {
    const res = await fetch(logoUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return DEFAULT_THEME;

    const arrayBuffer = await res.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);

    const { data, info } = await sharp(buf)
      .resize(48, 48, { fit: "inside" })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const colorCounts = new Map<string, number>();

    for (let i = 0; i < data.length; i += info.channels) {
      const a = info.channels === 4 ? data[i + 3] : 255;
      if (a < 70) continue; // Skip transparent

      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Skip near-white and near-black pixels
      if (r > 242 && g > 242 && b > 242) continue;
      if (r < 18 && g < 18 && b < 18) continue;

      // Quantize to steps of 16
      const qr = Math.round(r / 16) * 16;
      const qg = Math.round(g / 16) * 16;
      const qb = Math.round(b / 16) * 16;
      const key = `${qr},${qg},${qb}`;

      // Weight by saturation to prioritize vivid brand colors
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max === 0 ? 0 : (max - min) / max;
      const weight = 1 + sat * 3;

      colorCounts.set(key, (colorCounts.get(key) || 0) + weight);
    }

    let bestColorKey: string | null = null;
    let maxWeight = -1;

    for (const [key, weight] of colorCounts.entries()) {
      if (weight > maxWeight) {
        maxWeight = weight;
        bestColorKey = key;
      }
    }

    if (!bestColorKey) return DEFAULT_THEME;

    let [r, g, b] = bestColorKey.split(",").map(Number);

    // If color is excessively bright (e.g. bright yellow), tone down slightly
    // so white text and stats have good contrast
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum > 170) {
      [r, g, b] = adjustBrightness(r, g, b, 0.72);
    } else if (lum < 35) {
      // If too dark, brighten slightly for vibrant sports banner
      [r, g, b] = adjustBrightness(r, g, b, 1.4);
    }

    const [dr, dg, db] = adjustBrightness(r, g, b, 0.75);
    const [ddr, ddg, ddb] = adjustBrightness(r, g, b, 0.55);

    return {
      primary: rgbToHex(r, g, b),
      dark: rgbToHex(dr, dg, db),
      darker: rgbToHex(ddr, ddg, ddb),
      accent: lum > 120 ? "#ffffff" : "#f59e0b",
    };
  } catch (error) {
    console.error("Error extracting logo color:", error);
    return DEFAULT_THEME;
  }
}
