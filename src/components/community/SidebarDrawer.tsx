'use client'

import React, { useEffect } from 'react'
import { X, Trophy } from 'lucide-react'

interface SidebarDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100%'
      document.documentElement.style.overflow = 'hidden'
      document.documentElement.style.height = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.height = ''
      document.documentElement.style.overflow = ''
      document.documentElement.style.height = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.height = ''
      document.documentElement.style.overflow = ''
      document.documentElement.style.height = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        data-lenis-prevent
        className="relative w-full max-w-lg bg-[#FAFBFB] rounded-t-[2rem] shadow-2xl z-10 flex flex-col max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom duration-300 border-t border-[#0536971A]"
      >
        {/* Pull indicator */}
        <div className="w-12 h-1.5 bg-gray-300/80 rounded-full mx-auto mt-3 mb-2 shrink-0" />

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 pb-3 border-b border-[#0536970F] shrink-0">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#2FC191]" />
            <h3 className="font-bold text-[#053697]">Community Stats & Rewards</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div 
          className="flex-1 overflow-y-auto p-5 custom-sidebar-scrollbar"
          onTouchMove={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default SidebarDrawer
