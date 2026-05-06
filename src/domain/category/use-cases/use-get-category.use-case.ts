import { TParametersUseQuery, useQueryBase } from '@/hooks/use-query-base'
import type { ApiPaginatedResponse } from '@/lib/api-response'

import { categoryService } from '../category.service'
import type { TCategoryUi } from '../category.types'
import { categoryQueryKeys } from './query-keys'

export const useGetCategoryUseCase = (
  options?: TParametersUseQuery<ApiPaginatedResponse<TCategoryUi>>,
) => {
  return useQueryBase({
    queryKey: categoryQueryKeys.getList(),
    queryFn: async () => {
      const response = await categoryService.getList() // TODO: thêm params để filter/sort/paginate, ví dụ: { page: number; pageSize: number; status?: TCategoryStatus }
      return response
    },
    ...options,
  })
}
