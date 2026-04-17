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
import { loginUiSchema } from '@/schemas/auth/auth.schema'
import type { LoginUiDto } from '@/schemas/auth/auth.types'
import { getErrorMessage } from '@/lib/utils'
import type { LoginPageContent } from '../page.content'

export function LoginForm({ content }: { content: LoginPageContent }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUiDto>({
    resolver: zodResolver(loginUiSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginUiDto) => {
    setLoading(true)
    try {
      await authService.login(data)
      toast.success(content.form.success)
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
        <Label htmlFor="email" className={errors.email ? 'text-red-500' : ''}>
          {content.form.email}
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
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className={errors.password ? 'text-red-500' : ''}>
            {content.form.password}
          </Label>
          <a
            href="#"
            className="text-sm font-medium text-green-600 hover:text-green-500 transition"
          >
            {content.form.forgotPassword}
          </a>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••"
          {...register('password')}
          className={errors.password ? 'border-red-500 focus:ring-red-500' : ''}
        />
        {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
      </div>

      <Button type="submit" disabled={loading} className="w-full mt-2">
        {loading ? content.form.submitting : content.form.submit}
      </Button>
    </form>
  )
}
