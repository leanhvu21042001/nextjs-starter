import { useQueryClient } from '@tanstack/react-query'

import { TParametersUseMutation, useMutationBase } from '@/hooks/use-mutation-base'

import { categoryService } from '../category.service'
import { categoryQueryKeys } from './query-keys'

export const useDeleteCategoryUseCase = (options?: TParametersUseMutation) => {
  const queryClient = useQueryClient()

  return useMutationBase({
    mutationFn: async (id: unknown) => {
      return await categoryService.delete(id as string)
    },
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.getList(),
      })
      queryClient.removeQueries({
        queryKey: categoryQueryKeys.getById(variables as string),
      })
      if (options?.onSuccess) {
        options.onSuccess(data, variables, onMutateResult, context)
      }
    },
  })
}
