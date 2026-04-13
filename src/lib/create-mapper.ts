import { z } from 'zod'

// ─────────────────────────────────────────────────────────────────────────────
// Generic Mapper Factory
//
// Dùng để tạo mapper object chuẩn hóa cho mọi feature (category, product, ...).
// Enforces luồng: UI DTO → Payload DTO → API → Response DTO → UI Model
//
// Usage:
//   export const categoryMapper = createMapper({ ... })
// ─────────────────────────────────────────────────────────────────────────────

type AnyZodObject = z.ZodTypeAny

export type MapperOptions<
  TUiSchema extends AnyZodObject,
  TCreatePayloadSchema extends AnyZodObject,
  TUpdatePayloadSchema extends AnyZodObject,
  TDeletePayloadSchema extends AnyZodObject,
  TResponseSchema extends AnyZodObject,
  TModel,
> = {
  /** Zod schema để validate dữ liệu nhập từ UI form */
  uiSchema: TUiSchema

  /** Zod schema cho payload tạo mới (POST) */
  createPayloadSchema: TCreatePayloadSchema

  /** Zod schema cho payload cập nhật (PUT/PATCH) */
  updatePayloadSchema: TUpdatePayloadSchema

  /** Zod schema cho payload xóa (DELETE) */
  deletePayloadSchema: TDeletePayloadSchema

  /** Zod schema để validate response nhận từ API */
  responseSchema: TResponseSchema

  /**
   * Transform validated UI data → create payload shape
   * Input đã được validate bởi uiSchema
   */
  toCreatePayload: (validated: z.output<TUiSchema>) => z.input<TCreatePayloadSchema>

  /**
   * Transform validated UI data + id → update payload shape
   * Input đã được validate bởi uiSchema
   */
  toUpdatePayload: (validated: z.output<TUiSchema>, id: string) => z.input<TUpdatePayloadSchema>

  /**
   * Transform validated response data → UI Model
   * Input đã được validate bởi responseSchema
   */
  fromResponse: (validated: z.output<TResponseSchema>) => TModel
}

// ─────────────────────────────────────────────────────────────────────────────
// Factory Function
// ─────────────────────────────────────────────────────────────────────────────

export function createMapper<
  TUiSchema extends AnyZodObject,
  TCreatePayloadSchema extends AnyZodObject,
  TUpdatePayloadSchema extends AnyZodObject,
  TDeletePayloadSchema extends AnyZodObject,
  TResponseSchema extends AnyZodObject,
  TModel,
>(
  options: MapperOptions<
    TUiSchema,
    TCreatePayloadSchema,
    TUpdatePayloadSchema,
    TDeletePayloadSchema,
    TResponseSchema,
    TModel
  >,
) {
  const {
    uiSchema,
    createPayloadSchema,
    updatePayloadSchema,
    deletePayloadSchema,
    responseSchema,
    toCreatePayload,
    toUpdatePayload,
    fromResponse,
  } = options

  return {
    // ── Mutations ─────────────────────────────────────────────────────────────

    /**
     * Validate UI form data → transform → validate payload → return API payload
     * @throws {z.ZodError} nếu dữ liệu không hợp lệ
     */
    create(uiData: z.input<TUiSchema>): z.output<TCreatePayloadSchema> {
      const validated = uiSchema.parse(uiData) as z.output<TUiSchema>
      const raw = toCreatePayload(validated)
      return createPayloadSchema.parse(raw) as z.output<TCreatePayloadSchema>
    },

    /**
     * Validate UI form data + id → transform → validate payload → return API payload
     * @throws {z.ZodError} nếu dữ liệu không hợp lệ
     */
    update(uiData: z.input<TUiSchema>, id: string): z.output<TUpdatePayloadSchema> {
      const validated = uiSchema.parse(uiData) as z.output<TUiSchema>
      const raw = toUpdatePayload(validated, id)
      return updatePayloadSchema.parse(raw) as z.output<TUpdatePayloadSchema>
    },

    /**
     * Validate id → return delete payload
     * @throws {z.ZodError} nếu id không hợp lệ
     */
    delete(id: string): z.output<TDeletePayloadSchema> {
      return deletePayloadSchema.parse({ id }) as z.output<TDeletePayloadSchema>
    },

    // ── Queries ───────────────────────────────────────────────────────────────

    /**
     * Parse & validate response từ API → return UI Model
     * @throws {z.ZodError} nếu response không đúng format
     */
    fromResponse(responseData: unknown): TModel {
      const validated = responseSchema.parse(responseData) as z.output<TResponseSchema>
      return fromResponse(validated)
    },

    /**
     * Parse & validate mảng response từ API → return UI Model[]
     */
    fromList(responseList: unknown[]): TModel[] {
      return responseList.map((item) => this.fromResponse(item))
    },

    // ── Schema exposure (dùng cho form libraries như react-hook-form + zodResolver) ─

    schemas: {
      ui: uiSchema,
      createPayload: createPayloadSchema,
      updatePayload: updatePayloadSchema,
      deletePayload: deletePayloadSchema,
      response: responseSchema,
    },
  }
}
