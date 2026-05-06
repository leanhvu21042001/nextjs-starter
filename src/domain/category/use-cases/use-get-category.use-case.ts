import { TParametersUseQuery, useQueryBase } from '@/hooks/use-query-base'

import { categoryService } from '../category.service'
import type { TCategoryUi } from '../category.types'
import { categoryQueryKeys } from './query-keys'

export const useGetCategoryUseCase = (options?: TParametersUseQuery<TCategoryUi[]>) => {
  return useQueryBase({
    queryKey: categoryQueryKeys.getList(),
    queryFn: async () => {
      const response = await categoryService.getList() // TODO: thêm params để filter/sort/paginate, ví dụ: { page: number; pageSize: number; status?: TCategoryStatus }
      return response.data.items
    },
    ...options,
  })
}
