'use client'

import React, { useState, useEffect } from 'react'
import { X, DollarSign, Heart, CheckCircle2, Sparkles, Send } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getLevelIcon } from './helpers'
import { levelColors } from './data/mockData'
import { Post } from '@/types/community'

interface TipModalProps {
  post: Post | null
  isOpen: boolean
  onClose: () => void
  onConfirmTip: (postId: string, amount: number) => void
}

const PRESET_AMOUNTS = [5, 10, 25, 50, 100]

export const TipModal: React.FC<TipModalProps> = ({
  post,
  isOpen,
  onClose,
  onConfirmTip,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(10)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [note, setNote] = useState<string>('')
  const [step, setStep] = useState<'input' | 'success'>('input')
  const [submittedAmount, setSubmittedAmount] = useState<number>(0)

  // Reset modal state when opened/closed
  useEffect(() => {
    if (isOpen) {
      setStep('input')
      setSelectedAmount(10)
      setCustomAmount('')
      setNote('')
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen || !post) return null

  const levelColor = levelColors[post.user.level] || levelColors.Bronze

  // Determine effective tipping amount
  const finalAmount = customAmount
    ? parseFloat(customAmount) || 0
    : selectedAmount || 0

  const isValidAmount = finalAmount > 0

  const handleSelectPreset = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
      setCustomAmount(val)
      setSelectedAmount(null)
    }
  }

  const handleSubmitTip = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidAmount) return

    setSubmittedAmount(finalAmount)
    onConfirmTip(post.id, finalAmount)
    setStep('success')
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Container: Clean UI with smooth border */}
      <div
        className="relative bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden border border-[#233A6C1A] z-10 animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
          aria-label="Close Tip Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'input' ? (
          /* STEP 1: Tip Amount Selection Form */
          <form onSubmit={handleSubmitTip} className="p-6 sm:p-7">
            {/* Modal Title / Recipient Card */}
            <div className="text-center mb-6">
              <div className="relative inline-block mb-3">
                <Avatar className="w-16 h-16 border-2 border-[#308D6F]/30">
                  <AvatarImage src={post.user.avatar} alt={post.user.name} />
                  <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div
                  className="absolute -bottom-1 -right-1 p-1 rounded-full text-white shadow-sm"
                  style={{ backgroundColor: '#308D6F' }}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-[#233A6C]">
                Send Tip to {post.user.name}
              </h3>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <span className="text-xs text-[#233A6C70]">Supporting creator</span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{
                    backgroundColor: levelColor.bg,
                    color: levelColor.text,
                    border: `1px solid ${levelColor.border}`,
                  }}
                >
                  {getLevelIcon(post.user.level)}
                  {post.user.level}
                </span>
              </div>
            </div>

            {/* Preset Amount Options */}
            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#233A6C70] mb-2.5">
                Select Amount
              </label>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_AMOUNTS.map((amt) => {
                  const isSelected = selectedAmount === amt && !customAmount
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleSelectPreset(amt)}
                      className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-colors border ${
                        isSelected
                          ? 'bg-[#308D6F] text-white border-[#308D6F]'
                          : 'bg-[#F8FAFC] text-[#233A6C] border-[#233A6C12] hover:bg-gray-100 hover:border-[#233A6C20]'
                      }`}
                    >
                      ${amt}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#233A6C70] mb-2">
                Or Custom Amount
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-sm text-[#233A6C60]">
                  $
                </span>
                <input
                  type="text"
                  placeholder="Custom amount (e.g. 15)"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl text-sm font-semibold outline-none bg-[#F8FAFC] border border-[#233A6C18] text-[#233A6C] focus:bg-white focus:border-[#308D6F] transition-all"
                />
              </div>
            </div>

            {/* Optional Note */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#233A6C70] mb-2">
                Add Note (Optional)
              </label>
              <input
                type="text"
                placeholder="Write a message of support..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm outline-none bg-[#F8FAFC] border border-[#233A6C18] text-[#233A6C] focus:bg-white focus:border-[#308D6F] transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValidAmount}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              style={{ backgroundColor: '#308D6F' }}
            >
              <Send className="w-4 h-4" />
              <span>Send ${finalAmount > 0 ? finalAmount : '0'} Tip</span>
            </button>
          </form>
        ) : (
          /* STEP 2: Celebratory Success Modal */
          <div className="p-8 text-center animate-in fade-in duration-200">
            {/* Celebration Icon */}
            <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#308D6F15] text-[#308D6F]">
              <CheckCircle2 className="w-9 h-9 text-[#308D6F]" />
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-400" />
              <Heart className="absolute -bottom-1 -left-1 w-4 h-4 text-rose-500 fill-rose-500" />
            </div>

            <h3 className="text-xl font-bold text-[#233A6C] mb-1.5">
              Tip Sent Successfully! 🎉
            </h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              You sent <span className="font-bold text-[#308D6F]">${submittedAmount}</span> to{' '}
              <span className="font-semibold text-[#233A6C]">{post.user.name}</span>. Thank you for supporting creator content!
            </p>

            {note && (
              <div className="mb-6 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#233A6C10] text-xs text-slate-600 italic">
                &quot;{note}&quot;
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 shadow-sm"
              style={{ backgroundColor: '#308D6F' }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TipModal
