'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

import { Image } from './image'

const sizeStyles = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: keyof typeof sizeStyles
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false)
    const showFallback = !src || imgError

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 overflow-hidden rounded-full bg-slate-100',
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {!showFallback && (
          <Image
            src={src}
            alt={alt ?? ''}
            className="aspect-square h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
        {showFallback && (
          <span className="flex h-full w-full items-center justify-center font-medium text-slate-600">
            {fallback ?? (alt ? alt.slice(0, 2).toUpperCase() : '?')}
          </span>
        )}
      </div>
    )
  },
)
Avatar.displayName = 'Avatar'
