'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

// ─── Context ──────────────────────────────────────────────────────────────────

interface RadioGroupContextValue {
  name: string
  value: string
  onValueChange: (value: string) => void
  disabled?: boolean
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null)

// ─── RadioGroup ───────────────────────────────────────────────────────────────

export interface RadioGroupProps {
  /** Form field name shared by all radio inputs inside the group */
  name: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

/**
 * RadioGroup manages the selected value and passes it to all RadioItem children.
 *
 * react-hook-form (Controller) pattern:
 * ```tsx
 * <FormField control={form.control} name="role" render={({ field }) => (
 *   <RadioGroup name="role" value={field.value} onValueChange={field.onChange}>
 *     <RadioItem value="admin" label="Admin" />
 *     <RadioItem value="user"  label="User"  />
 *   </RadioGroup>
 * )} />
 * ```
 */
export function RadioGroup({
  name,
  value,
  defaultValue = '',
  onValueChange,
  disabled,
  className,
  children,
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const handleChange = (val: string) => {
    if (!isControlled) setInternalValue(val)
    onValueChange?.(val)
  }

  return (
    <RadioGroupContext.Provider
      value={{ name, value: currentValue, onValueChange: handleChange, disabled }}
    >
      <div role="radiogroup" className={cn('flex flex-col gap-2', className)}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

// ─── RadioItem ────────────────────────────────────────────────────────────────

export interface RadioItemProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'name' | 'value' | 'onChange'
> {
  value: string
  label?: React.ReactNode
  description?: React.ReactNode
}

export const RadioItem = React.forwardRef<HTMLInputElement, RadioItemProps>(
  ({ value, label, description, id, disabled: itemDisabled, className, ...props }, ref) => {
    const ctx = React.useContext(RadioGroupContext)
    const generatedId = React.useId()
    const radioId = id ?? generatedId

    const isDisabled = !!ctx?.disabled || !!itemDisabled
    const isChecked = ctx?.value === value

    return (
      <label
        htmlFor={radioId}
        className={cn(
          'inline-flex cursor-pointer select-none items-start gap-2',
          isDisabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <span className="relative mt-0.5 shrink-0">
          <input
            type="radio"
            ref={ref}
            id={radioId}
            name={ctx?.name}
            value={value}
            checked={isChecked}
            disabled={isDisabled}
            onChange={() => ctx?.onValueChange(value)}
            className="sr-only"
            {...props}
          />
          {/* outer circle */}
          <span
            className={cn(
              'flex size-4 items-center justify-center rounded-full border transition-colors',
              isChecked ? 'border-green-600' : 'border-slate-300',
              className,
            )}
            aria-hidden="true"
          >
            {/* inner dot — rendered conditionally so no CSS hack needed */}
            <span
              className={cn(
                'size-2 rounded-full transition-colors',
                isChecked ? 'bg-green-600' : 'bg-transparent',
              )}
            />
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
RadioItem.displayName = 'RadioItem'
