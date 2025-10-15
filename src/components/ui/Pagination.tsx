'use client'

import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage <= 3) {
        // Near the start
        for (let i = 2; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // In the middle
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Previous Button */}
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
        whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
        className={`p-2 rounded-lg border-2 transition-all ${
          currentPage === 1
            ? 'border-[#2a2f3e] text-[#64748b] cursor-not-allowed'
            : 'border-[#00d4ff] text-[#00d4ff] hover:bg-[#00d4ff]/10'
        }`}
      >
        <FiChevronLeft size={20} />
      </motion.button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-[#64748b]">
                ...
              </span>
            )
          }

          const pageNumber = page as number
          const isActive = pageNumber === currentPage

          return (
            <motion.button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              whileHover={{ scale: isActive ? 1 : 1.1 }}
              whileTap={{ scale: isActive ? 1 : 0.9 }}
              className={`min-w-[40px] px-3 py-2 rounded-lg font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#ff1b6b] to-[#ff6b00] text-white'
                  : 'border border-[#2a2f3e] text-[#94a3b8] hover:border-[#00d4ff] hover:text-[#00d4ff]'
              }`}
            >
              {pageNumber}
            </motion.button>
          )
        })}
      </div>

      {/* Next Button */}
      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
        whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
        className={`p-2 rounded-lg border-2 transition-all ${
          currentPage === totalPages
            ? 'border-[#2a2f3e] text-[#64748b] cursor-not-allowed'
            : 'border-[#00d4ff] text-[#00d4ff] hover:bg-[#00d4ff]/10'
        }`}
      >
        <FiChevronRight size={20} />
      </motion.button>
    </div>
  )
}
