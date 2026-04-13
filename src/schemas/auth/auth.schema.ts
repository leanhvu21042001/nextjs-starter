import { z } from 'zod'

export const loginUiSchema = z.object({
  email: z.string({ error: 'Email là bắt buộc' }).email('Email không đúng định dạng'),
  password: z.string({ error: 'Mật khẩu là bắt buộc' }).min(6, 'Mật khẩu phải từ 6 ký tự trở lên'),
})

export const loginPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const authResponseSchema = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.string().check(z.uuid()),
    email: z.string().email(),
    name: z.string(),
  }),
})

export const registerUiSchema = z
  .object({
    name: z.string({ error: 'Họ và tên là bắt buộc' }).min(2, 'Vui lòng nhập họ và tên hợp lệ'),
    email: z.string({ error: 'Email là bắt buộc' }).email('Email không đúng định dạng'),
    password: z
      .string({ error: 'Mật khẩu là bắt buộc' })
      .min(6, 'Mật khẩu phải từ 6 ký tự trở lên'),
    confirmPassword: z.string({ error: 'Vui lòng xác nhận mật khẩu' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

export const registerPayloadSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})
