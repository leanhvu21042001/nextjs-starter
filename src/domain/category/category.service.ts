import { AppError, toAppError } from '@/domain/error'
import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api-response'
import fetcher from '@/lib/fetcher'

import { categoryMapper } from './category.mapper'
import { TCategoryUi } from './category.types'

// ─────────────────────────────────────────────────────────────────────────────
// QUERY PARAMS
// ─────────────────────────────────────────────────────────────────────────────

function withErrorContext(
  error: unknown,
  params: Record<string, string | number | boolean>,
): AppError {
  const appError = toAppError(error)

  return new AppError(appError.code, {
    ...appError.options,
    params: {
      ...appError.params,
      ...params,
    },
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export const categoryService = {
  /**
   * GET /categories — lấy danh sách categories (có phân trang)
   */
  async getList() // TODO: thêm params để filter/sort/paginate, ví dụ: { page: number; pageSize: number; status?: TCategoryStatus }
  // params?: GetCategoriesParams
  : Promise<ApiPaginatedResponse<TCategoryUi>> {
    try {
      const data = await fetcher.get<ApiPaginatedResponse<TCategoryUi>>('/categories', {
        // params,
      })

      return {
        ...data,
        data: {
          ...data.data,
          items: categoryMapper.fromList(data.data.items),
        },
      }
    } catch (error) {
      throw toAppError(error)
    }
  },

  /**
   * GET /categories/:id — lấy chi tiết một category
   */
  async getById(id: string): Promise<TCategoryUi> {
    try {
      const data = await fetcher.get<ApiResponse<TCategoryUi>>(`/categories/${id}`)
      return categoryMapper.fromResponse(data.data)
    } catch (error) {
      throw withErrorContext(error, { resource: 'category', id })
    }
  },

  /**
   * POST /categories — tạo mới category
   * @param uiData - dữ liệu từ form (sẽ được validate & transform bởi mapper)
   */
  async create(uiData: TCategoryUi): Promise<TCategoryUi> {
    // Mapper validate UI input → tạo API payload
    try {
      const payload = categoryMapper.create(uiData)

      const data = await fetcher.post<ApiResponse<TCategoryUi>>('/categories', payload)
      return categoryMapper.fromResponse(data.data)
    } catch (error) {
      throw withErrorContext(error, { resource: 'category', name: uiData.name })
    }
  },

  /**
   * PUT /categories/:id — cập nhật category
   * @param id - ID của category cần update
   * @param uiData - dữ liệu từ form (sẽ được validate & transform bởi mapper)
   */
  async update(id: string, uiData: TCategoryUi): Promise<TCategoryUi> {
    // Mapper validate UI input → tạo API payload (kèm id)
    try {
      const payload = categoryMapper.update(uiData, id)

      const data = await fetcher.put<ApiResponse<TCategoryUi>>(`/categories/${id}`, payload)
      return categoryMapper.fromResponse(data.data)
    } catch (error) {
      throw withErrorContext(error, { resource: 'category', id, name: uiData.name })
    }
  },

  /**
   * DELETE /categories/:id — xóa category
   * @param id - ID của category cần xóa
   */
  async delete(id: string): Promise<void> {
    // Mapper validate id là UUID hợp lệ
    try {
      const payload = categoryMapper.delete(id)

      await fetcher.delete<void>(`/categories/${payload.id}`)
    } catch (error) {
      throw withErrorContext(error, { resource: 'category', id })
    }
  },
}
