'use client'

import React from 'react'

export const CommunityHeader: React.FC = () => {
  return (
    <div
      className="w-full px-4 sm:px-8 pt-8 pb-6"
      style={{
        backgroundColor: '#FAFBFB',
      }}
    >
      <div className="container mx-auto">
        {/* Breadcrumb */}
        <p className="text-xs font-medium mb-2" style={{ color: '#308D6F' }}>
          Community / Social Feed
        </p>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1
              className="text-3xl sm:text-4xl font-extrabold"
              style={{ color: '#233A6C' }}
            >
              Community 🔥
            </h1>
            <p className="text-sm mt-2" style={{ color: '#233A6C80' }}>
              Share your thoughts, celebrate moments, and earn rewards
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityHeader
