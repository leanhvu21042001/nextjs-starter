'use client'

import { X } from 'lucide-react'

import * as React from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/utils'

// ─── Context ──────────────────────────────────────────────────────────────────

interface DialogContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue>({
  open: false,
  onOpenChange: () => {},
})

// ─── Dialog root ──────────────────────────────────────────────────────────────

export interface DialogProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

export function Dialog({ open, defaultOpen = false, onOpenChange, children }: DialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen

  const handleOpenChange = (value: boolean) => {
    if (!isControlled) setInternalOpen(value)
    onOpenChange?.(value)
  }

  return (
    <DialogContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

// ─── DialogTrigger ────────────────────────────────────────────────────────────

export const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, ...props }, ref) => {
  const { onOpenChange } = React.useContext(DialogContext)
  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        onOpenChange(true)
        onClick?.(e)
      }}
      {...props}
    />
  )
})
DialogTrigger.displayName = 'DialogTrigger'

// ─── DialogClose ──────────────────────────────────────────────────────────────

export const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, ...props }, ref) => {
  const { onOpenChange } = React.useContext(DialogContext)
  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        onOpenChange(false)
        onClick?.(e)
      }}
      {...props}
    />
  )
})
DialogClose.displayName = 'DialogClose'

// ─── DialogContent ────────────────────────────────────────────────────────────

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  hideClose?: boolean
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, hideClose = false, children, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(DialogContext)
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => setMounted(true), [])

    React.useEffect(() => {
      if (!open) return
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onOpenChange(false)
      }
      document.addEventListener('keydown', handler)
      return () => document.removeEventListener('keydown', handler)
    }, [open, onOpenChange])

    React.useEffect(() => {
      document.body.style.overflow = open ? 'hidden' : ''
      return () => {
        document.body.style.overflow = ''
      }
    }, [open])

    if (!mounted || !open) return null

    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          aria-hidden="true"
          onClick={() => onOpenChange(false)}
        />
        {/* Panel */}
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          className={cn(
            'relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl focus:outline-none',
            className,
          )}
          {...props}
        >
          {!hideClose && (
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-md p-1 text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {children}
        </div>
      </div>,
      document.body,
    )
  },
)
DialogContent.displayName = 'DialogContent'

// ─── Subcomponents ────────────────────────────────────────────────────────────

export const DialogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-4 flex flex-col gap-1.5 pr-6', className)} {...props} />
  ),
)
DialogHeader.displayName = 'DialogHeader'

export const DialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-6 flex items-center justify-end gap-3', className)}
      {...props}
    />
  ),
)
DialogFooter.displayName = 'DialogFooter'

export const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn('text-lg font-semibold text-slate-900', className)} {...props} />
))
DialogTitle.displayName = 'DialogTitle'

export const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-slate-500', className)} {...props} />
))
DialogDescription.displayName = 'DialogDescription'
