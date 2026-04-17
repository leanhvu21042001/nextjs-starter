import type { Locale } from '@/lib/i18n/config'

const registerPageContent = {
  en: {
    meta: {
      title: 'Create account',
      description: 'Create a new account to start using the application.',
    },
    title: 'Create a new account',
    subtitle: 'Already have an account?',
    loginLink: 'Sign in here',
    form: {
      name: 'Full name',
      namePlaceholder: 'E.g. John Doe',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password',
      submit: 'Create account',
      submitting: 'Creating account...',
      success: 'Account created successfully!',
    },
  },
  vi: {
    meta: {
      title: 'Tạo tài khoản',
      description: 'Tạo tài khoản mới để bắt đầu sử dụng ứng dụng.',
    },
    title: 'Tạo tài khoản mới',
    subtitle: 'Đã có tài khoản?',
    loginLink: 'Đăng nhập tại đây',
    form: {
      name: 'Họ và tên',
      namePlaceholder: 'Ví dụ: Nguyễn Văn A',
      email: 'Email',
      password: 'Mật khẩu',
      confirmPassword: 'Xác nhận mật khẩu',
      submit: 'Đăng ký tài khoản',
      submitting: 'Đang tạo tài khoản...',
      success: 'Đăng ký tài khoản thành công!',
    },
  },
} as const

export const getRegisterPageContent = (locale: Locale) => registerPageContent[locale]

export type RegisterPageContent = ReturnType<typeof getRegisterPageContent>
