'use client'

import { ChevronDown } from 'lucide-react'

import * as React from 'react'

import { cn } from '@/lib/utils'

// ─── Context ──────────────────────────────────────────────────────────────────

interface AccordionContextValue {
  openItems: string[]
  type: 'single' | 'multiple'
  onToggle: (value: string) => void
}

const AccordionContext = React.createContext<AccordionContextValue>({
  openItems: [],
  type: 'single',
  onToggle: () => {},
})

const AccordionItemContext = React.createContext<{
  value: string
  isOpen: boolean
  disabled: boolean
}>({ value: '', isOpen: false, disabled: false })

// ─── Accordion ────────────────────────────────────────────────────────────────

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  collapsible?: boolean
}

export function Accordion({
  type = 'single',
  defaultValue,
  value,
  onValueChange,
  collapsible = false,
  className,
  children,
  ...props
}: AccordionProps) {
  const normalize = (v?: string | string[]): string[] => {
    if (!v) return []
    return Array.isArray(v) ? v : [v]
  }

  const [internalOpen, setInternalOpen] = React.useState<string[]>(normalize(defaultValue))
  const isControlled = value !== undefined
  const openItems = isControlled ? normalize(value) : internalOpen

  const handleToggle = (itemValue: string) => {
    let next: string[]

    if (type === 'multiple') {
      next = openItems.includes(itemValue)
        ? openItems.filter((v) => v !== itemValue)
        : [...openItems, itemValue]
    } else {
      if (openItems.includes(itemValue)) {
        next = collapsible ? [] : openItems
      } else {
        next = [itemValue]
      }
    }

    if (!isControlled) setInternalOpen(next)
    onValueChange?.(type === 'single' ? (next[0] ?? '') : next)
  }

  return (
    <AccordionContext.Provider value={{ openItems, type, onToggle: handleToggle }}>
      <div
        className={cn('divide-y divide-slate-200 rounded-lg border border-slate-200', className)}
        {...props}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

// ─── AccordionItem ────────────────────────────────────────────────────────────

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  disabled?: boolean
}

export function AccordionItem({
  value,
  disabled = false,
  className,
  children,
  ...props
}: AccordionItemProps) {
  const { openItems } = React.useContext(AccordionContext)
  const isOpen = openItems.includes(value)

  return (
    <AccordionItemContext.Provider value={{ value, isOpen, disabled }}>
      <div className={cn('', className)} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

// ─── AccordionTrigger ─────────────────────────────────────────────────────────

export const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { onToggle } = React.useContext(AccordionContext)
  const { value, isOpen, disabled } = React.useContext(AccordionItemContext)

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      onClick={() => onToggle(value)}
      aria-expanded={isOpen}
      className={cn(
        'flex w-full items-center justify-between px-4 py-4 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          'h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200',
          isOpen && 'rotate-180',
        )}
        aria-hidden="true"
      />
    </button>
  )
})
AccordionTrigger.displayName = 'AccordionTrigger'

// ─── AccordionContent ─────────────────────────────────────────────────────────

export const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen } = React.useContext(AccordionItemContext)
  if (!isOpen) return null

  return (
    <div ref={ref} className={cn('px-4 pb-4 text-sm text-slate-600', className)} {...props}>
      {children}
    </div>
  )
})
AccordionContent.displayName = 'AccordionContent'
