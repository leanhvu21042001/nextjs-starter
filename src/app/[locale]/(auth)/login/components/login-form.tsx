'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { Box, Button, Form, Inline, Input, Label } from '@/components/ui'
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
    <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Box className="flex flex-col gap-2">
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
        {errors.email && <Inline className="text-xs text-red-500">{errors.email.message}</Inline>}
      </Box>

      <Box className="flex flex-col gap-2">
        <Box className="flex items-center justify-between">
          <Label htmlFor="password" className={errors.password ? 'text-red-500' : ''}>
            {content.form.password}
          </Label>
          <a
            href="#"
            className="text-sm font-medium text-green-600 hover:text-green-500 transition"
          >
            {content.form.forgotPassword}
          </a>
        </Box>
        <Input
          id="password"
          type="password"
          placeholder="••••••"
          {...register('password')}
          className={errors.password ? 'border-red-500 focus:ring-red-500' : ''}
        />
        {errors.password && (
          <Inline className="text-xs text-red-500">{errors.password.message}</Inline>
        )}
      </Box>

      <Button type="submit" disabled={loading} className="w-full mt-2">
        {loading ? content.form.submitting : content.form.submit}
      </Button>
    </Form>
  )
}
