'use client'

import { zodResolver } from '@hookform/resolvers/zod'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

import { useRouter } from 'next/navigation'

import { Box, Button, Form, Inline, Input, Label } from '@/components/ui'
import { type RegisterUiDto, authService, registerUiSchema } from '@/domain/auth'
import { getErrorMessage } from '@/lib/utils'

import type { RegisterPageContent } from '../page.content'

export function RegisterForm({ content }: { content: RegisterPageContent }) {
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
      toast.success(content.form.success)
      router.push('/dashboard')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Box className="rounded-none border-0 bg-transparent p-0 shadow-none flex flex-col gap-2">
        <Label htmlFor="name" className={errors.name ? 'text-red-500' : ''}>
          {content.form.name}
        </Label>
        <Input
          id="name"
          type="text"
          placeholder={String(content.form.namePlaceholder)}
          {...register('name')}
          className={errors.name ? 'border-red-500 focus:ring-red-500' : ''}
        />
        {errors.name && <Inline className="text-xs text-red-500">{errors.name.message}</Inline>}
      </Box>

      <Box className="rounded-none border-0 bg-transparent p-0 shadow-none flex flex-col gap-2">
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

      <Box className="rounded-none border-0 bg-transparent p-0 shadow-none flex flex-col gap-2">
        <Label htmlFor="password" className={errors.password ? 'text-red-500' : ''}>
          {content.form.password}
        </Label>
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

      <Box className="rounded-none border-0 bg-transparent p-0 shadow-none flex flex-col gap-2">
        <Label htmlFor="confirmPassword" className={errors.confirmPassword ? 'text-red-500' : ''}>
          {content.form.confirmPassword}
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••"
          {...register('confirmPassword')}
          className={errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}
        />
        {errors.confirmPassword && (
          <Inline className="text-xs text-red-500">{errors.confirmPassword.message}</Inline>
        )}
      </Box>

      <Button
        type="submit"
        disabled={loading}
        className="w-full mt-1 h-11 rounded-xl font-semibold"
      >
        {loading ? content.form.submitting : content.form.submit}
      </Button>
    </Form>
  )
}
