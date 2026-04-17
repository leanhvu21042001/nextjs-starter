import fetcher from '@/lib/fetcher'
import { categoryMapper } from '@/schemas/category/category.mapper'
import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api-response'
import type { CategoryModel, CategoryUiDto } from '@/types/category.types'

// ─────────────────────────────────────────────────────────────────────────────
// QUERY PARAMS
// ─────────────────────────────────────────────────────────────────────────────

export type GetCategoriesParams = {
  page?: number
  pageSize?: number
  search?: string
  status?: 'active' | 'inactive'
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export const categoryService = {
  /**
   * GET /categories — lấy danh sách categories (có phân trang)
   */
  async getList(params?: GetCategoriesParams): Promise<ApiPaginatedResponse<CategoryModel>> {
    const data = await fetcher.get<ApiPaginatedResponse<unknown>>('/categories', {
      params,
    })

    return {
      ...data,
      data: {
        ...data.data,
        items: categoryMapper.fromList(data.data.items),
      },
    }
  },

  /**
   * GET /categories/:id — lấy chi tiết một category
   */
  async getById(id: string): Promise<CategoryModel> {
    const data = await fetcher.get<ApiResponse<unknown>>(`/categories/${id}`)
    return categoryMapper.fromResponse(data.data)
  },

  /**
   * POST /categories — tạo mới category
   * @param uiData - dữ liệu từ form (sẽ được validate & transform bởi mapper)
   */
  async create(uiData: CategoryUiDto): Promise<CategoryModel> {
    // Mapper validate UI input → tạo API payload
    const payload = categoryMapper.create(uiData)

    const data = await fetcher.post<ApiResponse<unknown>>('/categories', payload)
    return categoryMapper.fromResponse(data.data)
  },

  /**
   * PUT /categories/:id — cập nhật category
   * @param id - ID của category cần update
   * @param uiData - dữ liệu từ form (sẽ được validate & transform bởi mapper)
   */
  async update(id: string, uiData: CategoryUiDto): Promise<CategoryModel> {
    // Mapper validate UI input → tạo API payload (kèm id)
    const payload = categoryMapper.update(uiData, id)

    const data = await fetcher.put<ApiResponse<unknown>>(`/categories/${id}`, payload)
    return categoryMapper.fromResponse(data.data)
  },

  /**
   * DELETE /categories/:id — xóa category
   * @param id - ID của category cần xóa
   */
  async delete(id: string): Promise<void> {
    // Mapper validate id là UUID hợp lệ
    const payload = categoryMapper.delete(id)

    await fetcher.delete(`/categories/${payload.id}`)
  },
}
