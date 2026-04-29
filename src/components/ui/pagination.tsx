'use client'

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

import * as React from 'react'

import { cn } from '@/lib/utils'

function getPageRange(page: number, totalPages: number, siblingCount: number): (number | '...')[] {
  const range = (start: number, end: number): number[] =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i)

  const totalShown = siblingCount * 2 + 5
  if (totalPages <= totalShown) return range(1, totalPages)

  const leftSibling = Math.max(page - siblingCount, 1)
  const rightSibling = Math.min(page + siblingCount, totalPages)
  const showLeft = leftSibling > 2
  const showRight = rightSibling < totalPages - 1

  if (!showLeft && showRight) {
    return [...range(1, 3 + siblingCount * 2), '...', totalPages]
  }

  if (showLeft && !showRight) {
    return [1, '...', ...range(totalPages - (2 + siblingCount * 2), totalPages)]
  }

  return [1, '...', ...range(leftSibling, rightSibling), '...', totalPages]
}

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
  ...props
}: PaginationProps) {
  const pages = getPageRange(page, totalPages, siblingCount)

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1', className)}
      {...props}
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-9 w-9 items-center justify-center text-slate-400"
          >
            <MoreHorizontal className="h-4 w-4" />
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p as number)}
            aria-current={page === p ? 'page' : undefined}
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors',
              page === p
                ? 'bg-green-600 text-white'
                : 'border border-slate-300 text-slate-700 hover:bg-slate-50',
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
