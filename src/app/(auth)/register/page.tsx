import { RegisterForm } from './components/register-form'
import Link from 'next/link'

/**
 * Route: /register
 */
export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            Tạo tài khoản mới
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Đã có tài khoản?{' '}
            <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
              Đăng nhập tại đây
            </Link>
          </p>
        </div>

        <RegisterForm />
      </div>
    </main>
  )
}
