import { IMAGE } from '@/constant/image.index'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'

const stats = [
  { value: '3×', label: 'More fan engagement' },
  { value: '$0', label: 'Platform fees' },
  { value: '100%', label: 'Paid directly to you' },
]

function ForAthletes() {
  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Badge + Heading */}
        <div className="text-center mb-12 lg:mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 border"
            style={{
              background: 'rgba(42,146,109,0.06)',
              borderColor: 'rgba(42,146,109,0.22)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#308D6F] animate-pulse" aria-hidden="true" />
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#308D6F]">
              For Athletes
            </span>
          </div>

          <h2 className="text-3xl font-e sm:text-4xl md:text-5xl font-black text-[#1A2A23] mb-4 leading-[1.1] tracking-[-0.03em]">
            Why female athletes love{' '}
            <span className="text-[#308D6F]">PROTIPPZ</span>
          </h2>

          <p className="text-[#57606A] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Direct fan income, stronger fan relationships, and recognition beyond
            contracts and sponsorships — PROTIPPZ puts power back in the hands of athletes.
          </p>
        </div>

        {/* Main Card */}
        <div
          className="rounded-3xl border overflow-hidden"
          style={{
            background: 'rgba(42,146,109,0.04)',
            borderColor: 'rgba(42,146,109,0.15)',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Image Side */}
            <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-[520px]">
              <Image
                src={IMAGE.femalePlayer}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top"
                alt="Female athlete supported by PROTIPPZ fans"
              />
              {/* Gradient overlay — fades into card bg on mobile (bottom), desktop (right) */}
              <div className="absolute inset-0 bg-linear-to-t from-[#f0faf6]/90 via-transparent to-transparent lg:bg-linear-to-r lg:from-transparent lg:to-[#f0faf6]/80" />

              {/* Floating stat pill */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-2.5 bg-white/90 backdrop-blur-sm border border-white rounded-2xl px-4 py-3 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#308D6F]/10 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2l1.5 3.5H13l-2.75 2 1 3.5L8 9.25 4.75 11l1-3.5L3 5.5h3.5L8 2z" stroke="#308D6F" strokeWidth="1.25" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] text-[#57606A] leading-none mb-0.5">Avg. monthly tips</p>
                  <p className="text-sm font-bold text-[#1A2A23] leading-none">$420 / athlete</p>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">

              {/* Stats row */}
              <div className="flex flex-wrap gap-6 mb-8">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl sm:text-3xl font-black text-[#308D6F] leading-none mb-0.5">{s.value}</p>
                    <p className="text-xs text-[#57606A] font-medium">{s.label}</p>
                  </div>
                ))}
              </div>

              <h3 className="text-2xl font-e sm:text-3xl lg:text-4xl font-black text-[#1A2A23] leading-[1.15] tracking-[-0.025em] mb-4">
                Direct fan income —{' '}
                <span className="text-[#308D6F]">no middlemen,</span>{' '}
                no gatekeepers
              </h3>

              <p className="text-[#57606A] text-sm sm:text-base leading-relaxed mb-8 max-w-md">
                Every tip from fans flows directly to the athlete — instantly, transparently, and
                without platform cuts. Build stronger fan relationships and earn income that truly
                reflects your talent and effort, beyond contracts and traditional sponsorships.
              </p>

              {/* Feature list */}
              <ul className="space-y-2.5 mb-10">
                {[
                  'Instant payouts to your account',
                  'Full fan analytics dashboard',
                  'Exclusive rewards to offer your fans',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-[#1A2A23] font-medium">
                    <span className="w-4 h-4 rounded-full bg-[#308D6F]/10 flex items-center justify-center shrink-0">
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 2.5" stroke="#308D6F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="bg-[#154098] hover:bg-[#0f2f70] text-white rounded-full px-7 py-5 text-sm font-semibold uppercase tracking-wide cursor-pointer transition-colors"
                >
                  Join as an Athlete
                </Button>
                <Button
                  variant="outline"
                  className="border-[#154098] text-[#154098] hover:bg-[#154098]/5 rounded-full px-7 py-5 text-sm font-semibold uppercase tracking-wide cursor-pointer transition-colors bg-transparent"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2 shrink-0">
                    <path d="M3.18 23.76C3.656 24 4.24 24 5.407 24h13.186c1.168 0 1.752 0 2.228-.24a2.4 2.4 0 0 0 1.05-1.05c.129-.253.188-.547.212-.965C22 21.5 22 20.5 22 19V5c0-1.5 0-2.5-.116-2.745a2.4 2.4 0 0 0-1.05-1.05C20.358 1 19.774 1 18.607 1H5.407c-1.168 0-1.752 0-2.228.24a2.4 2.4 0 0 0-1.05 1.05C2 2.766 2 3.35 2 4.517v14.966c0 1.168 0 1.752.24 2.228a2.4 2.4 0 0 0 .94.05zM8.5 18.5v-13l9 6.5-9 6.5z"/>
                  </svg>
                  Get on Play Store
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default ForAthletes