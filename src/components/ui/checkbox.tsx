import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode
  description?: React.ReactNode
}

/**
 * Custom styled checkbox.
 * Works with react-hook-form via `...register('field')` or Controller.
 *
 * Visual trick: the checkmark SVG is always white — invisible on white
 * background (unchecked) and visible on green background (checked).
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, disabled, ...props }, ref) => {
    const generatedId = React.useId()
    const checkboxId = id ?? generatedId

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          'inline-flex cursor-pointer select-none items-start gap-2',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        {/* wrapper keeps input + visual as siblings so peer-checked works */}
        <span className="relative mt-0.5 shrink-0">
          <input
            type="checkbox"
            ref={ref}
            id={checkboxId}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          {/* visual box — sibling of input (peer), styles update via peer-checked */}
          <span
            className={cn(
              'flex size-4 items-center justify-center rounded border border-slate-300 bg-white transition-colors',
              'peer-checked:border-green-600 peer-checked:bg-green-600',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-green-500 peer-focus-visible:ring-offset-1',
              className,
            )}
            aria-hidden="true"
          >
            {/* always white — invisible on white bg, visible on green bg */}
            <svg
              className="size-3 text-white"
              fill="none"
              viewBox="0 0 12 12"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
            </svg>
          </span>
        </span>

        {(label != null || description != null) && (
          <span className="flex flex-col">
            {label != null && <span className="text-sm font-medium leading-none">{label}</span>}
            {description != null && (
              <span className="mt-0.5 text-xs text-slate-500">{description}</span>
            )}
          </span>
        )}
      </label>
    )
  },
)
Checkbox.displayName = 'Checkbox'
