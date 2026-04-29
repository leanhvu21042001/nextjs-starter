import * as React from 'react'

import { cn } from '@/lib/utils'

const variants = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  destructive: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  outline: 'border border-slate-300 text-slate-700 bg-transparent',
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    />
  ),
)
Badge.displayName = 'Badge'
