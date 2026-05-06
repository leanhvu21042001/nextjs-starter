'use client'

import { useRouter } from 'next/navigation'

import { Box, Button, Form, Inline, Input, Label, Link } from '@/components/ui'
import { type LoginUiDto, loginUiSchema, useLoginUseCase } from '@/domain/auth'
import { resolveErrorMessage } from '@/lib/error/resolve-error-message'
import { toast, useForm, zodResolver } from '@/lib/form-client'

import type { LoginPageContent } from '../page.content'

export function LoginForm({ content }: { content: LoginPageContent }) {
  const router = useRouter()
  const loginMutation = useLoginUseCase()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUiDto>({
    resolver: zodResolver(loginUiSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginUiDto) => {
    try {
      await loginMutation.mutateAsync(data)
      toast.success(content.form.success)
      router.push('/dashboard')
    } catch (error) {
      toast.error(resolveErrorMessage(error))
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
        {errors.email && (
          <Inline className="text-xs text-red-500">
            {resolveErrorMessage(errors.email.message)}
          </Inline>
        )}
      </Box>

      <Box className="rounded-none border-0 bg-transparent p-0 shadow-none flex flex-col gap-2">
        <Box className="rounded-none border-0 bg-transparent p-0 shadow-none flex items-center justify-between">
          <Label htmlFor="password" className={errors.password ? 'text-red-500' : ''}>
            {content.form.password}
          </Label>
          <Link
            href="/contact"
            className="text-sm font-medium text-green-600 transition hover:text-green-500"
          >
            {content.form.forgotPassword}
          </Link>
        </Box>
        <Input
          id="password"
          type="password"
          placeholder="••••••"
          {...register('password')}
          className={errors.password ? 'border-red-500 focus:ring-red-500' : ''}
        />
        {errors.password && (
          <Inline className="text-xs text-red-500">
            {resolveErrorMessage(errors.password.message)}
          </Inline>
        )}
      </Box>

      <Button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full mt-1 h-11 rounded-xl font-semibold"
      >
        {loginMutation.isPending ? content.form.submitting : content.form.submit}
      </Button>
    </Form>
  )
}
