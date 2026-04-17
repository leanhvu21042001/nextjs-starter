import * as React from 'react'
import { cn } from '@/lib/utils'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 2, className, ...props }, ref) => {
    const Tag = `h${level}` as HeadingTag
    return <Tag ref={ref} className={cn(className)} {...props} />
  },
)

Heading.displayName = 'Heading'
