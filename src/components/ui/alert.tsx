import * as React from 'react'
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

const variants = {
  default: {
    container: 'bg-slate-50 border-slate-200 text-slate-800',
    Icon: Info,
  },
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    Icon: CheckCircle2,
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    Icon: AlertTriangle,
  },
  destructive: {
    container: 'bg-red-50 border-red-200 text-red-800',
    Icon: AlertCircle,
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    Icon: Info,
  },
}

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants
  icon?: React.ReactNode
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', icon, children, ...props }, ref) => {
    const { container, Icon } = variants[variant]
    return (
      <div
        ref={ref}
        role="alert"
        className={cn('relative flex gap-3 rounded-lg border p-4', container, className)}
        {...props}
      >
        <span className="mt-0.5 shrink-0">
          {icon ?? <Icon className="h-4 w-4" aria-hidden="true" />}
        </span>
        <div className="flex flex-col gap-1">{children}</div>
      </div>
    )
  },
)
Alert.displayName = 'Alert'

export const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm font-semibold leading-none', className)} {...props} />
))
AlertTitle.displayName = 'AlertTitle'

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => <p ref={ref} className={cn('text-sm', className)} {...props} />)
AlertDescription.displayName = 'AlertDescription'
