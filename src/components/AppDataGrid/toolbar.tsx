import { Badge, Button, Inline } from '@/components/ui'
import { Box } from '@/components/ui'

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
  text,
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
    <Box className="mb-3 flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white/80 p-3 shadow-none">
      <Box className="flex flex-wrap items-center gap-2 rounded-none border-0 bg-transparent p-0 shadow-none">
        <Button
          type="button"
          size="sm"
          onClick={onAdd}
          disabled={isSaving || isRefreshing || isDisabled('add', disabledActions)}
        >
          {text.add}
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
          {text.update}
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
          {text.delete(selectedCount)}
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onSave}
          disabled={isSaving || isRefreshing || isDisabled('save', disabledActions)}
        >
          {isSaving ? text.saving : text.saveChanges}
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onRefresh}
          disabled={isSaving || isRefreshing || isDisabled('refresh', disabledActions)}
        >
          {isRefreshing ? text.refreshing : text.refresh}
        </Button>

        <Box className="ml-auto flex items-center gap-2 rounded-none border-0 bg-transparent p-0 shadow-none">
          <Badge variant="success">{text.success(successItems.length)}</Badge>
          <Badge variant="destructive">{text.failed(failedItems.length)}</Badge>
        </Box>
      </Box>

      {(writeError || readError) && (
        <Box className="rounded-md border border-red-200/80 bg-red-50 p-2 text-sm text-red-700 shadow-none">
          {writeError ?? readError}
        </Box>
      )}

      {failedItems.length > 0 && (
        <Box className="rounded-md border border-amber-200/80 bg-amber-50 p-3 shadow-none">
          <Box className="mb-2 flex flex-wrap items-center gap-2 rounded-none border-0 bg-transparent p-0 shadow-none">
            <Inline className="text-sm font-medium text-amber-900">{text.failedMutations}</Inline>
            <Button type="button" size="sm" variant="secondary" onClick={onRetryAll}>
              {text.retryAll}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onRetrySelected}
              disabled={selectedFailedKeys.size === 0}
            >
              {text.retrySelected(selectedFailedKeys.size)}
            </Button>
          </Box>

          <Box className="max-h-44 space-y-1 overflow-auto pr-1 rounded-none border-0 bg-transparent p-0 shadow-none">
            {failedItems.map((item) => (
              <Box
                key={`${item.action}:${item.key}`}
                className="flex items-center gap-2 rounded border border-amber-200/80 bg-white p-2 shadow-none"
              >
                <input
                  type="checkbox"
                  checked={selectedFailedKeys.has(item.key)}
                  onChange={() => onToggleFailed(item.key)}
                />
                <Inline className="text-xs text-slate-700">
                  {text.actionKey(item.action.toUpperCase(), item.key)}
                </Inline>
                <Inline className="min-w-0 flex-1 truncate text-xs text-red-700">
                  {item.error ?? item.message ?? text.unknownError}
                </Inline>
                <Button type="button" size="sm" variant="outline" onClick={() => onRetryOne(item)}>
                  {text.retry}
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}
