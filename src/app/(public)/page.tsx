import Link from 'next/link'

/**
 * Route: /
 * Public Landing Page
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Next.js Clean Architecture
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Hệ thống quản lý được xây dựng dựa trên Atomic Design, React Data Grid xuất file Excel
            và các mẫu chuẩn Mapper, DTO.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/login"
              className="rounded-md bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              Đăng nhập ngay
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-semibold leading-6 text-slate-900 hover:text-green-600"
            >
              Vào Dashboard <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
