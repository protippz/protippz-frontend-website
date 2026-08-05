import React from 'react'
import {
  Trophy,
  Star,
  Medal,
  Crown as CrownIcon,
} from 'lucide-react'

export const getLevelIcon = (level: string) => {
  switch (level) {
    case 'Diamond':
      return <CrownIcon className="w-3 h-3" />
    case 'Platinum':
      return <Star className="w-3 h-3" />
    case 'Gold':
      return <Medal className="w-3 h-3" />
    case 'Silver':
      return <Trophy className="w-3 h-3" />
    default:
      return <Star className="w-3 h-3" />
  }
}

export const getEmbedVideoUrl = (videoInput?: string, videoEmbedCode?: string): string | null => {
  const target = videoEmbedCode || videoInput;
  if (!target) return null;

  // If raw iframe string was provided by admin (<iframe ... src="..."></iframe>)
  if (target.includes('<iframe')) {
    const srcMatch = target.match(/src=["']([^"']+)["']/);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }

  // If standard youtube watch URL was provided
  if (target.includes('youtube.com/watch?v=')) {
    const videoId = target.split('v=')[1]?.split('&')[0];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  // If short youtube URL (youtu.be/xxx)
  if (target.includes('youtu.be/')) {
    const videoId = target.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  // Otherwise assume target is already an embed URL
  return target;
};

