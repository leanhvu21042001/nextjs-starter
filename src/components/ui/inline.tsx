import * as React from 'react'
import { cn } from '@/lib/utils'

export type InlineProps = React.HTMLAttributes<HTMLSpanElement>

export const Inline = React.forwardRef<HTMLSpanElement, InlineProps>(
  ({ className, ...props }, ref) => {
    return <span ref={ref} className={cn(className)} {...props} />
  },
)

Inline.displayName = 'Inline'
