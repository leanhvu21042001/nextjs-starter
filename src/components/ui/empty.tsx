import { Inbox } from 'lucide-react'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export function Empty({
  className,
  title = 'No data',
  description,
  icon,
  action,
  ...props
}: EmptyProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center py-12 text-center', className)}
      {...props}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>
      <p className="text-sm font-medium text-slate-900">{title}</p>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
