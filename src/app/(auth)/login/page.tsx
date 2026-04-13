import { LoginForm } from './components/login-form'
import Link from 'next/link'

/**
 * Route: /login
 */
export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            Đăng nhập hệ thống
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Hoặc{' '}
            <Link href="/" className="font-medium text-green-600 hover:text-green-500">
              Quay về trang chủ
            </Link>
          </p>
        </div>

        <LoginForm />

        <div className="mt-4 flex flex-col gap-2 text-center text-xs text-gray-500">
          <p>
            Chưa có tài khoản?{' '}
            <Link href="/register" className="font-medium text-green-600 hover:text-green-500">
              Đăng ký ngay
            </Link>
          </p>
          <p className="text-gray-400 mt-2">* Sử dụng: admin@example.com / 123456</p>
        </div>
      </div>
    </main>
  )
}
