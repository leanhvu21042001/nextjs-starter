import * as React from 'react'

import { cn } from '@/lib/utils'

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode
  description?: React.ReactNode
}

/**
 * Toggle switch (uses a hidden checkbox under the hood).
 * Works with react-hook-form via `...register('field')` or Controller.
 *
 * DOM structure inside the positioning wrapper:
 *   <input peer sr-only />   ← peer
 *   <span track />           ← sibling: peer-checked changes bg
 *   <span thumb />           ← sibling: peer-checked translates right
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, id, disabled, ...props }, ref) => {
    const generatedId = React.useId()
    const switchId = id ?? generatedId

    return (
      <label
        htmlFor={switchId}
        className={cn(
          'inline-flex cursor-pointer select-none items-start gap-3',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        {/* positioning wrapper — input + track + thumb are siblings → peer works */}
        <span className="relative mt-0.5 shrink-0">
          <input
            type="checkbox"
            role="switch"
            ref={ref}
            id={switchId}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          {/* track */}
          <span
            className={cn(
              'block h-5 w-9 rounded-full border border-slate-300 bg-slate-200 transition-colors',
              'peer-checked:border-green-600 peer-checked:bg-green-600',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-green-500 peer-focus-visible:ring-offset-1',
              className,
            )}
            aria-hidden="true"
          />
          {/* thumb */}
          <span
            className="absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-4"
            aria-hidden="true"
          />
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
Switch.displayName = 'Switch'
