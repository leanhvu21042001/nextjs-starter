import * as React from 'react'
import { cn } from '@/lib/utils'

export type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement>

export const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={cn(className)} {...props} />
  },
)

Paragraph.displayName = 'Paragraph'
