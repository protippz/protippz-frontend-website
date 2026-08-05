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
