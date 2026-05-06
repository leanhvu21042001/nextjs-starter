import { TOptionsUseQuery, useQueryBase } from '@/hooks/use-query-base'

import { categoryService } from '../category.service'
import { categoryQueryKeys } from './query-keys'

export const useGetCategoryUseCase = (options?: TOptionsUseQuery) => {
  return useQueryBase({
    queryKey: categoryQueryKeys.getList(),
    queryFn: async () => {
      const response = await categoryService.getList() // TODO: thêm params để filter/sort/paginate, ví dụ: { page: number; pageSize: number; status?: TCategoryStatus }
      return response
    },
    ...options,
  })
}
