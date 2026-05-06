import { useQueryClient } from '@tanstack/react-query'

import { TParametersUseMutation, useMutationBase } from '@/hooks/use-mutation-base'

import { categoryService } from '../category.service'
import { categoryQueryKeys } from './query-keys'

export const useDeleteCategoryUseCase = (options?: TParametersUseMutation<void, string>) => {
  const queryClient = useQueryClient()

  return useMutationBase({
    mutationFn: async (id: string) => {
      return await categoryService.delete(id)
    },
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.getList(),
      })
      queryClient.removeQueries({
        queryKey: categoryQueryKeys.getById(variables),
      })
      if (options?.onSuccess) {
        options.onSuccess(data, variables, onMutateResult, context)
      }
    },
  })
}
