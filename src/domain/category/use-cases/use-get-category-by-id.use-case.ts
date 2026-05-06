import { TParametersUseQuery, useQueryBase } from '@/hooks/use-query-base'

import { categoryService } from '../category.service'
import { categoryQueryKeys } from './query-keys'

export const useGetCategoryByIdUseCase = (id: string, options?: TParametersUseQuery) => {
  return useQueryBase({
    queryKey: categoryQueryKeys.getById(id),
    queryFn: async () => {
      const response = await categoryService.getById(id)
      return response
    },
    ...options,
  })
}
