'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { authService } from '@/services/auth.service'
import { registerUiSchema } from '@/schemas/auth/auth.schema'
import type { RegisterUiDto } from '@/schemas/auth/auth.types'
import { getErrorMessage } from '@/lib/utils'

export function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUiDto>({
    resolver: zodResolver(registerUiSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (data: RegisterUiDto) => {
    setLoading(true)
    try {
      await authService.register(data)
      toast.success('Đăng ký tài khoản thành công!')
      router.push('/dashboard')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name" className={errors.name ? 'text-red-500' : ''}>
          Họ và tên
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Ví dụ: Nguyễn Văn A"
          {...register('name')}
          className={errors.name ? 'border-red-500 focus:ring-red-500' : ''}
        />
        {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email" className={errors.email ? 'text-red-500' : ''}>
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@example.com"
          {...register('email')}
          className={errors.email ? 'border-red-500 focus:ring-red-500' : ''}
        />
        {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password" className={errors.password ? 'text-red-500' : ''}>
          Mật khẩu
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••"
          {...register('password')}
          className={errors.password ? 'border-red-500 focus:ring-red-500' : ''}
        />
        {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword" className={errors.confirmPassword ? 'text-red-500' : ''}>
          Xác nhận mật khẩu
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••"
          {...register('confirmPassword')}
          className={errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}
        />
        {errors.confirmPassword && (
          <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full mt-2">
        {loading ? 'Đang tạo tài khoản...' : 'Đăng ký tài khoản'}
      </Button>
    </form>
  )
}
