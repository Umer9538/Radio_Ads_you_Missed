'use client'

import { motion } from 'framer-motion'
import { FiClock, FiTag, FiPercent } from 'react-icons/fi'
import ClaimOfferButton from './ClaimOfferButton'

interface OfferCardProps {
  offer: {
    id: string
    title: string
    description: string
    terms?: string | null
    expiryDate?: Date | null
    redemptionType: string
    redemptionValue?: string | null
    discountPercent?: number | null
    discountAmount?: number | null
    originalPrice?: number | null
    maxClaims?: number | null
    claimCount: number
  }
  isClaimed?: boolean
  onClaimSuccess?: () => void
  className?: string
}

export default function OfferCard({
  offer,
  isClaimed = false,
  onClaimSuccess,
  className = ''
}: OfferCardProps) {
  const formatExpiryDate = (date: Date | null) => {
    if (!date) return 'No expiry'
    const expiryDate = new Date(date)
    const now = new Date()
    const diffTime = expiryDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'Expired'
    if (diffDays === 0) return 'Expires today'
    if (diffDays === 1) return 'Expires tomorrow'
    if (diffDays <= 7) return `Expires in ${diffDays} days`
    return `Expires ${expiryDate.toLocaleDateString()}`
  }

  const getRedemptionTypeLabel = (type: string) => {
    switch (type) {
      case 'URL':
        return 'Online'
      case 'CODE':
        return 'Promo Code'
      case 'QR_CODE':
        return 'QR Code'
      case 'FORM':
        return 'Form'
      case 'IN_STORE':
        return 'In Store'
      default:
        return type
    }
  }

  const isExpired = offer.expiryDate && new Date(offer.expiryDate) < new Date()
  const isMaxClaimed = offer.maxClaims && offer.claimCount >= offer.maxClaims

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#1a1f2e] rounded-2xl p-6 border-2 border-[#00ff88]/30 hover:border-[#00ff88]/50 transition-all ${className}`}
    >
      {/* Header with discount badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{offer.title}</h3>
          {(offer.discountPercent || offer.discountAmount) && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] rounded-full">
              <FiPercent className="text-white" size={16} />
              <span className="text-white font-bold">
                {offer.discountPercent
                  ? `${offer.discountPercent}% OFF`
                  : `$${offer.discountAmount} OFF`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-[#94a3b8] mb-4 leading-relaxed">{offer.description}</p>

      {/* Terms */}
      {offer.terms && (
        <div className="mb-4 p-3 bg-[#0a0f1e] rounded-xl">
          <p className="text-xs text-[#64748b]">
            <span className="font-semibold text-[#94a3b8]">Terms: </span>
            {offer.terms}
          </p>
        </div>
      )}

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm">
        {/* Expiry */}
        <div className="flex items-center gap-2">
          <FiClock className={isExpired ? 'text-red-400' : 'text-[#94a3b8]'} />
          <span className={isExpired ? 'text-red-400' : 'text-[#94a3b8]'}>
            {formatExpiryDate(offer.expiryDate)}
          </span>
        </div>

        {/* Redemption type */}
        <div className="flex items-center gap-2">
          <FiTag className="text-[#94a3b8]" />
          <span className="text-[#94a3b8]">
            {getRedemptionTypeLabel(offer.redemptionType)}
          </span>
        </div>

        {/* Claims remaining */}
        {offer.maxClaims && (
          <div className="text-[#94a3b8]">
            {offer.maxClaims - offer.claimCount} / {offer.maxClaims} remaining
          </div>
        )}
      </div>

      {/* Claim button or status */}
      {isExpired ? (
        <div className="px-6 py-3 rounded-xl bg-[#64748b]/20 text-[#64748b] font-bold text-center">
          Offer Expired
        </div>
      ) : isMaxClaimed ? (
        <div className="px-6 py-3 rounded-xl bg-[#64748b]/20 text-[#64748b] font-bold text-center">
          No More Claims Available
        </div>
      ) : (
        <ClaimOfferButton
          offerId={offer.id}
          offerTitle={offer.title}
          isClaimed={isClaimed}
          onClaimSuccess={onClaimSuccess}
        />
      )}
    </motion.div>
  )
}
