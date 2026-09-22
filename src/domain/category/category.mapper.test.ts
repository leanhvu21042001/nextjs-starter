import { describe, expect, it } from 'vitest'

import { categoryMapper } from './category.mapper'
import { categorySchemas } from './category.schema'

const baseCategory = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Điện thoại Samsung',
  slug: '',
  description: '  ',
  status: categorySchemas.CATEGORY_STATUS.enum.active,
}

describe('categoryMapper', () => {
  it('generates slug and normalizes description for create payload', () => {
    const payload = categoryMapper.create(baseCategory)

    expect(payload).toEqual({
      name: 'Điện thoại Samsung',
      slug: 'ien-thoai-samsung',
      description: null,
      status: 'active',
    })
  })

  it('maps update payload with id and generated slug', () => {
    const payload = categoryMapper.update(baseCategory, baseCategory.id)

    expect(payload).toEqual({
      id: baseCategory.id,
      name: 'Điện thoại Samsung',
      slug: 'ien-thoai-samsung',
      description: null,
      status: 'active',
    })
  })
})
