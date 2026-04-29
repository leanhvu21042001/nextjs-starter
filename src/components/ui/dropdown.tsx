'use client'

import { Check } from 'lucide-react'

import * as React from 'react'

import { cn } from '@/lib/utils'

// ─── Context ──────────────────────────────────────────────────────────────────

interface DropdownContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownContext = React.createContext<DropdownContextValue>({
  open: false,
  setOpen: () => {},
})

// ─── DropdownMenu root ────────────────────────────────────────────────────────

export interface DropdownMenuProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

export function DropdownMenu({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: DropdownMenuProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleOpenChange = (val: boolean) => {
    if (!isControlled) setInternalOpen(val)
    onOpenChange?.(val)
  }

  React.useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleOpenChange(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <DropdownContext.Provider value={{ open: isOpen, setOpen: handleOpenChange }}>
      <div ref={containerRef} className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

// ─── DropdownMenuTrigger ──────────────────────────────────────────────────────

export const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, ...props }, ref) => {
  const { open, setOpen } = React.useContext(DropdownContext)
  return (
    <button
      ref={ref}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={(e) => {
        setOpen(!open)
        onClick?.(e)
      }}
      {...props}
    />
  )
})
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'

// ─── DropdownMenuContent ──────────────────────────────────────────────────────

const alignClasses = {
  start: 'left-0',
  center: 'left-1/2 -translate-x-1/2',
  end: 'right-0',
}

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: keyof typeof alignClasses
}

export const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, align = 'start', children, ...props }, ref) => {
    const { open } = React.useContext(DropdownContext)
    if (!open) return null

    return (
      <div
        ref={ref}
        role="menu"
        className={cn(
          'absolute top-full z-50 mt-1 min-w-[8rem] overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-md',
          alignClasses[align],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
DropdownMenuContent.displayName = 'DropdownMenuContent'

// ─── DropdownMenuLabel ────────────────────────────────────────────────────────

export interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean
}

export const DropdownMenuLabel = React.forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  ({ className, inset, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400',
        inset && 'pl-8',
        className,
      )}
      {...props}
    />
  ),
)
DropdownMenuLabel.displayName = 'DropdownMenuLabel'

// ─── DropdownMenuItem ─────────────────────────────────────────────────────────

export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean
  destructive?: boolean
}

export const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  ({ className, inset, destructive, onClick, ...props }, ref) => {
    const { setOpen } = React.useContext(DropdownContext)
    return (
      <button
        ref={ref}
        role="menuitem"
        type="button"
        onClick={(e) => {
          setOpen(false)
          onClick?.(e)
        }}
        className={cn(
          'relative flex w-full cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm transition-colors focus:outline-none hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50',
          inset && 'pl-8',
          destructive ? 'text-red-600 hover:bg-red-50' : 'text-slate-700',
          className,
        )}
        {...props}
      />
    )
  },
)
DropdownMenuItem.displayName = 'DropdownMenuItem'

// ─── DropdownMenuCheckItem ────────────────────────────────────────────────────

export interface DropdownMenuCheckItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const DropdownMenuCheckItem = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuCheckItemProps
>(({ className, checked = false, onCheckedChange, onClick, children, ...props }, ref) => {
  const { setOpen } = React.useContext(DropdownContext)
  return (
    <button
      ref={ref}
      role="menuitemcheckbox"
      aria-checked={checked}
      type="button"
      onClick={(e) => {
        onCheckedChange?.(!checked)
        setOpen(false)
        onClick?.(e)
      }}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-3 text-sm text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Check className="h-3 w-3" />}
      </span>
      {children}
    </button>
  )
})
DropdownMenuCheckItem.displayName = 'DropdownMenuCheckItem'

// ─── DropdownMenuSeparator ────────────────────────────────────────────────────

export const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} role="separator" className={cn('my-1 h-px bg-slate-200', className)} {...props} />
))
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'
