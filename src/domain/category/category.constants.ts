import { categorySchemas } from './category.schema'

const CATEGORY_STATUS_LABELS: Record<keyof typeof categorySchemas.CATEGORY_STATUS.enum, string> = {
  [categorySchemas.CATEGORY_STATUS.enum.active]: 'Active User',
  [categorySchemas.CATEGORY_STATUS.enum.inactive]: 'Inactive User',
}

export const categoryConstants = {
  CATEGORY_STATUS_LABELS,
}
