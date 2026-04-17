import type { Locale } from '@/lib/i18n/config'

const loginPageContent = {
  en: {
    meta: {
      title: 'Sign in',
      description: 'Sign in to access your account and continue to the dashboard.',
    },
    title: 'Sign in to your account',
    subtitle: 'Or',
    backHome: 'go back to home',
    noAccount: "Don't have an account?",
    register: 'Register now',
    hint: '* Use: admin@example.com / 123456',
    form: {
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot password?',
      submit: 'Sign in',
      submitting: 'Verifying...',
      success: 'Logged in successfully!',
    },
  },
  vi: {
    meta: {
      title: 'Đăng nhập',
      description: 'Đăng nhập để truy cập tài khoản và tiếp tục vào trang quản trị.',
    },
    title: 'Đăng nhập hệ thống',
    subtitle: 'Hoặc',
    backHome: 'quay về trang chủ',
    noAccount: 'Chưa có tài khoản?',
    register: 'Đăng ký ngay',
    hint: '* Sử dụng: admin@example.com / 123456',
    form: {
      email: 'Email',
      password: 'Mật khẩu',
      forgotPassword: 'Quên mật khẩu?',
      submit: 'Đăng nhập',
      submitting: 'Đang xác thực...',
      success: 'Đăng nhập thành công!',
    },
  },
} as const

export const getLoginPageContent = (locale: Locale) => loginPageContent[locale]

export type LoginPageContent = ReturnType<typeof getLoginPageContent>
