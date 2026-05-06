import { useQueryClient } from '@tanstack/react-query'

import { type TOptionsUseMutation, useMutationBase } from '@/hooks/use-mutation-base'

import { categoryService } from '../category.service'
import { TCategoryUi } from '../category.types'
import { categoryQueryKeys } from './query-keys'

export const useCreateCategoryUseCase = (data: TCategoryUi, options?: TOptionsUseMutation) => {
  const queryClient = useQueryClient()

  return useMutationBase({
    mutationFn: async () => {
      const response = await categoryService.create(data)
      return response
    },
    options: {
      ...options,
      onSuccess: (data, variables, onMutateResult, context) => {
        // Invalidate or refetch queries related to categories to ensure the UI is up-to-date
        // For example, if you have a query for the category list, you can invalidate it here:
        queryClient.invalidateQueries({
          queryKey: categoryQueryKeys.getList(), // Điều này sẽ làm mới lại danh sách category sau khi tạo mới thành công
        })
        if (options?.onSuccess) {
          options.onSuccess(data, variables, onMutateResult, context)
        }
      },
    },
  })
}
