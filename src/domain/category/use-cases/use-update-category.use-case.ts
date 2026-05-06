import { useQueryClient } from '@tanstack/react-query'

import { TParametersUseMutation, useMutationBase } from '@/hooks/use-mutation-base'

import { categoryService } from '../category.service'
import { TCategoryUi } from '../category.types'
import { categoryQueryKeys } from './query-keys'

type TUpdateCategoryVariables = {
  id: string
  data: TCategoryUi
}

export const useUpdateCategoryUseCase = (options?: TParametersUseMutation) => {
  const queryClient = useQueryClient()

  return useMutationBase({
    mutationFn: async (variables: unknown) => {
      const { id, data } = variables as TUpdateCategoryVariables
      const response = await categoryService.update(id, data)
      return response
    },
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.getList(),
      })
      queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.getById((variables as TUpdateCategoryVariables).id),
      })
      if (options?.onSuccess) {
        options.onSuccess(data, variables, onMutateResult, context)
      }
    },
  })
}
