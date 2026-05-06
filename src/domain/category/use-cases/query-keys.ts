export const categoryQueryKeys = {
  getList: () => ['category.getList'] as const,
  getById: (id: string) => ['category.getById', id] as const,
}
