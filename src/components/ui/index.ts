// ─── Primitives ───────────────────────────────────────────────────────────────
export { Button } from './button'
export type { ButtonProps } from './button'

export { Input } from './input'
export type { InputProps } from './input'

export { Label } from './label'
export type { LabelProps } from './label'

export { Textarea } from './textarea'
export type { TextareaProps } from './textarea'

export { Select } from './select'
export type { SelectProps, SelectOption } from './select'

export { Checkbox } from './checkbox'
export type { CheckboxProps } from './checkbox'

export { RadioGroup, RadioItem } from './radio'
export type { RadioGroupProps, RadioItemProps } from './radio'

export { Switch } from './switch'
export type { SwitchProps } from './switch'

export { Empty } from './empty'
export type { EmptyProps } from './empty'

export { Box } from './box'
export type { BoxProps } from './box'

export { Link } from './link'

// ─── Form (react-hook-form integration) ──────────────────────────────────────
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from './form'

// ─── Display ──────────────────────────────────────────────────────────────────
export { Badge } from './badge'
export type { BadgeProps } from './badge'

export { Avatar } from './avatar'
export type { AvatarProps } from './avatar'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'

export { Spinner } from './spinner'
export type { SpinnerProps } from './spinner'

export { Alert, AlertTitle, AlertDescription } from './alert'
export type { AlertProps } from './alert'

export { Separator } from './separator'
export type { SeparatorProps } from './separator'

export { Skeleton } from './skeleton'
export type { SkeletonProps } from './skeleton'

export { Progress } from './progress'
export type { ProgressProps } from './progress'

// ─── Data display ─────────────────────────────────────────────────────────────
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './table'

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from './breadcrumb'

export { Pagination } from './pagination'
export type { PaginationProps } from './pagination'

// ─── Interactive (client) ─────────────────────────────────────────────────────
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'
export type { TabsProps, TabsTriggerProps, TabsContentProps } from './tabs'

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion'
export type { AccordionProps, AccordionItemProps } from './accordion'

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog'
export type { DialogProps, DialogContentProps } from './dialog'

export { Tooltip } from './tooltip'
export type { TooltipProps } from './tooltip'

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckItem,
  DropdownMenuSeparator,
} from './dropdown'
export type {
  DropdownMenuProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuCheckItemProps,
} from './dropdown'
