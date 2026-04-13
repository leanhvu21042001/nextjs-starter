# Next.js Starter — Mapper + DTO Pattern

> **Stack**: Next.js 16 App Router · TypeScript · Zod v4 · Axios

---

## Kiến trúc Mapper + DTO

Mục tiêu: chuẩn hóa và type-safe toàn bộ luồng dữ liệu:

```
UI Form Input
    ↓  uiSchema.parse()         ← validate, throw nếu lỗi
UI DTO (validated form values)
    ↓  toCreatePayload()        ← transform (slug, null coercion...)
Payload DTO (raw)
    ↓  createPayloadSchema.parse()
Validated Payload              → gửi lên API (Axios)
                               ← nhận response
Response Raw
    ↓  responseSchema.parse()   ← validate API response
Response DTO (validated)
    ↓  fromResponse()           ← transform (string → Date, rename...)
UI Model                       → hiển thị lên component
```

---

## Cấu trúc thư mục

```
src/
├── lib/
│   ├── axios.ts              # Axios instance + interceptors
│   ├── api-response.ts       # Generic ApiResponse<T> Zod schema
│   └── create-mapper.ts      # 🔑 Generic mapper factory
│
├── schemas/
│   ├── index.ts              # Barrel: export tất cả mappers
│   └── category/
│       ├── index.ts          # Barrel: export category schemas + mapper
│       ├── category.schema.ts  # 3 lớp schema (UI / Payload / Response)
│       └── category.mapper.ts  # categoryMapper dùng createMapper()
│
├── services/
│   ├── index.ts              # Barrel: export tất cả services
│   └── category.service.ts   # API calls dùng axiosInstance + categoryMapper
│
└── types/
    └── category.types.ts     # TypeScript types (inferred từ Zod schemas)
```

---

## Schema: 3 lớp

```ts
// category.schema.ts

// Lớp 1: UI Form
export const categoryUiSchema = z.object({
  name: z.string({ error: 'Bắt buộc' }).min(2).max(100).trim(),
  slug: z.string().max(120).optional().or(z.literal('')),
  description: z.string().max(500).optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']),
})

// Lớp 2: API Payload
export const categoryCreatePayloadSchema = z.object({ name, slug, description, status })
export const categoryUpdatePayloadSchema = categoryCreatePayloadSchema.extend({ id })
export const categoryDeletePayloadSchema = z.object({ id })

// Lớp 3: API Response
export const categoryResponseSchema = z.object({
  id,
  name,
  slug,
  description,
  status,
  createdAt,
  updatedAt,
})
```

---

## Mapper: dùng `createMapper` factory

```ts
// category.mapper.ts
export const categoryMapper = createMapper({
  uiSchema: categoryUiSchema,
  createPayloadSchema: categoryCreatePayloadSchema,
  updatePayloadSchema: categoryUpdatePayloadSchema,
  deletePayloadSchema: categoryDeletePayloadSchema,
  responseSchema: categoryResponseSchema,

  toCreatePayload: (validated) => ({
    ...validated,
    slug: validated.slug || generateSlug(validated.name),
  }),
  toUpdatePayload: (validated, id) => ({ id, ...validated }),
  fromResponse: (validated): CategoryModel => ({
    ...validated,
    createdAt: new Date(validated.createdAt),
  }),
})
```

`categoryMapper` tự động có các method:

| Method                              | Input                      | Output                               |
| ----------------------------------- | -------------------------- | ------------------------------------ |
| `categoryMapper.create(uiData)`     | `CategoryUiDto`            | `CategoryCreatePayloadDto`           |
| `categoryMapper.update(uiData, id)` | `CategoryUiDto` + `string` | `CategoryUpdatePayloadDto`           |
| `categoryMapper.delete(id)`         | `string`                   | `CategoryDeletePayloadDto`           |
| `categoryMapper.fromResponse(raw)`  | `unknown`                  | `CategoryModel`                      |
| `categoryMapper.fromList(rawList)`  | `unknown[]`                | `CategoryModel[]`                    |
| `categoryMapper.schemas.ui`         | —                          | `categoryUiSchema` (cho zodResolver) |

---

## Tạo mapper mới cho feature khác

```ts
// src/schemas/product/product.mapper.ts
import { createMapper } from '@/lib/create-mapper'

export const productMapper = createMapper({
  uiSchema: productUiSchema,
  createPayloadSchema: productCreatePayloadSchema,
  updatePayloadSchema: productUpdatePayloadSchema,
  deletePayloadSchema: productDeletePayloadSchema,
  responseSchema: productResponseSchema,

  toCreatePayload: (v) => ({ ... }),
  toUpdatePayload: (v, id) => ({ id, ... }),
  fromResponse: (v): ProductModel => ({ ... }),
})
```

---

## Sử dụng trong Service

```ts
// category.service.ts
async create(uiData: CategoryUiDto): Promise<CategoryModel> {
  const payload = categoryMapper.create(uiData) // validate + transform
  const { data } = await axiosInstance.post('/categories', payload)
  return categoryMapper.fromResponse(data.data)  // parse response
}
```

---

## Sử dụng với react-hook-form + zodResolver

```tsx
import { categoryMapper } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'

const form = useForm<CategoryUiDto>({
  resolver: zodResolver(categoryMapper.schemas.ui),
})

const onSubmit = async (values: CategoryUiDto) => {
  await categoryService.create(values)
}
```

---

## Types (zero duplication — inferred từ Zod)

```ts
// category.types.ts
export type CategoryUiDto            = z.infer<typeof categoryUiSchema>
export type CategoryCreatePayloadDto = z.infer<typeof categoryCreatePayloadSchema>
export type CategoryUpdatePayloadDto = z.infer<typeof categoryUpdatePayloadSchema>
export type CategoryDeletePayloadDto = z.infer<typeof categoryDeletePayloadSchema>
export type CategoryResponseDto      = z.infer<typeof categoryResponseSchema>

// Model là type tay — sau khi transform (Date, rename, etc.)
export type CategoryModel = { id: string; name: string; createdAt: Date; ... }
```
