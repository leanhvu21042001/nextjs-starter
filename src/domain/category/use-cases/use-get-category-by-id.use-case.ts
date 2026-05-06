import { TParametersUseQuery, useQueryBase } from '@/hooks/use-query-base'

import { categoryService } from '../category.service'
import type { TCategoryUi } from '../category.types'
import { categoryQueryKeys } from './query-keys'

export const useGetCategoryByIdUseCase = (
  id: string,
  options?: TParametersUseQuery<TCategoryUi>,
) => {
  return useQueryBase({
    queryKey: categoryQueryKeys.getById(id),
    queryFn: async () => {
      const response = await categoryService.getById(id)
      return response
    },
    ...options,
  })
}
