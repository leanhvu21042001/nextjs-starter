import * as React from 'react'
import { cn } from '@/lib/utils'

export type BoxProps = React.HTMLAttributes<HTMLDivElement>

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('rounded-lg border border-gray-200 bg-white p-4 shadow-sm', className)}
      {...props}
    />
  )
})
Box.displayName = 'Box'
