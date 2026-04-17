import type { TKeyGrid } from './app-data-grid.types'

export type RowMutationState = 'idle' | 'pending' | 'modified' | 'deleted' | 'success' | 'error'

export type CrudAction = 'add' | 'update' | 'delete'

export type MutationMode = 'single' | 'batch'

export interface MutationResultItem<TRow> {
  action: CrudAction
  key: string
  row: TRow
  status: 'success' | 'error'
  message?: string
  error?: string
  attempts?: number
}

export interface RowFieldConfig<TRow> {
  key: keyof TRow & string
  label?: string
  showInAdd?: boolean
  showInEdit?: boolean
  defaultValue?: unknown | (() => unknown)
  required?: boolean
  validate?: (value: unknown, rowValues: Partial<TRow>) => string | null
}

export interface ConcurrencyConfig {
  limit?: number
  delayBetweenBatches?: number
}

export interface GridCrudHandlers<TRow> {
  onAdd?: (row: TRow) => Promise<TRow>
  onUpdate?: (row: TRow) => Promise<TRow>
  onDelete?: (row: TRow) => Promise<void>
  onRefresh?: (params?: Record<string, string>) => Promise<readonly TRow[]>

  onAddMany?: (rows: TRow[]) => Promise<MutationResultItem<TRow>[]>
  onUpdateMany?: (rows: TRow[]) => Promise<MutationResultItem<TRow>[]>
  onDeleteMany?: (rows: TRow[]) => Promise<MutationResultItem<TRow>[]>
}

export interface GridToolbarConfig<TRow> {
  createMode?: 'inline' | 'modal'
  updateMode?: 'inline' | 'modal'
  requireDeleteConfirm?: boolean
  fieldConfigs?: Partial<Record<keyof TRow & string, RowFieldConfig<TRow>>>
  disabledActions?: Array<'add' | 'save' | 'update' | 'delete' | 'refresh'>
  refreshParams?: Record<string, string>
  mutationMode?: MutationMode
  concurrency?: ConcurrencyConfig
  handlers?: GridCrudHandlers<TRow>
}

export interface GridToolbarViewProps<TRow> {
  selectedCount: number
  disabledActions?: Array<'add' | 'save' | 'update' | 'delete' | 'refresh'>
  isSaving: boolean
  isRefreshing: boolean

  mutationResults: MutationResultItem<TRow>[]
  selectedFailedKeys: Set<string>
  onToggleFailed: (key: string) => void
  onRetryOne: (item: MutationResultItem<TRow>) => void
  onRetryAll: () => void
  onRetrySelected: () => void

  onAdd: () => void
  onUpdate: () => void
  onDelete: () => void
  onSave: () => void
  onRefresh: () => void

  readError?: string | null
  writeError?: string | null
}

export type RowMutationMap = Record<string, { state: RowMutationState; error?: string }>

export const toKeyString = (value: TKeyGrid): string => String(value)
