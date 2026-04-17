import { Button, Badge } from '@/components/ui'
import type { GridToolbarViewProps } from './toolbar.types'

const isDisabled = (
  action: 'add' | 'save' | 'update' | 'delete' | 'refresh',
  disabledActions?: Array<'add' | 'save' | 'update' | 'delete' | 'refresh'>,
) => disabledActions?.includes(action) ?? false

export function GridToolbar<TRow>({
  selectedCount,
  disabledActions,
  isSaving,
  isRefreshing,
  mutationResults,
  selectedFailedKeys,
  onToggleFailed,
  onRetryOne,
  onRetryAll,
  onRetrySelected,
  onAdd,
  onUpdate,
  onDelete,
  onSave,
  onRefresh,
  readError,
  writeError,
}: GridToolbarViewProps<TRow>) {
  const failedItems = mutationResults.filter((item) => item.status === 'error')
  const successItems = mutationResults.filter((item) => item.status === 'success')

  return (
    <div className="mb-3 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={onAdd}
          disabled={isSaving || isRefreshing || isDisabled('add', disabledActions)}
        >
          Add
        </Button>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={onUpdate}
          disabled={
            isSaving || isRefreshing || selectedCount !== 1 || isDisabled('update', disabledActions)
          }
        >
          Update
        </Button>

        <Button
          type="button"
          size="sm"
          variant="destructive"
          onClick={onDelete}
          disabled={
            isSaving || isRefreshing || selectedCount === 0 || isDisabled('delete', disabledActions)
          }
        >
          Delete {selectedCount > 0 ? `(${selectedCount})` : ''}
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onSave}
          disabled={isSaving || isRefreshing || isDisabled('save', disabledActions)}
        >
          {isSaving ? 'Saving...' : 'Save changes'}
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onRefresh}
          disabled={isSaving || isRefreshing || isDisabled('refresh', disabledActions)}
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <Badge variant="success">Success: {successItems.length}</Badge>
          <Badge variant="destructive">Failed: {failedItems.length}</Badge>
        </div>
      </div>

      {(writeError || readError) && (
        <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          {writeError ?? readError}
        </div>
      )}

      {failedItems.length > 0 && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-amber-900">Failed mutations</span>
            <Button type="button" size="sm" variant="secondary" onClick={onRetryAll}>
              Retry all
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onRetrySelected}
              disabled={selectedFailedKeys.size === 0}
            >
              Retry selected ({selectedFailedKeys.size})
            </Button>
          </div>

          <div className="max-h-44 space-y-1 overflow-auto pr-1">
            {failedItems.map((item) => (
              <div
                key={`${item.action}:${item.key}`}
                className="flex items-center gap-2 rounded border border-amber-200 bg-white p-2"
              >
                <input
                  type="checkbox"
                  checked={selectedFailedKeys.has(item.key)}
                  onChange={() => onToggleFailed(item.key)}
                />
                <span className="text-xs text-slate-700">
                  {item.action.toUpperCase()} - key: {item.key}
                </span>
                <span className="min-w-0 flex-1 truncate text-xs text-red-700">
                  {item.error ?? item.message ?? 'Unknown error'}
                </span>
                <Button type="button" size="sm" variant="outline" onClick={() => onRetryOne(item)}>
                  Retry
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
