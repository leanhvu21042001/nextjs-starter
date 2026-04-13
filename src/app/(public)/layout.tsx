import Link from 'next/link'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl text-green-700 tracking-tight">
              AppLogo
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Trang chủ
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Giới thiệu
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Liên hệ
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg shadow-sm transition"
            >
              Tham gia ngay
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Next.js Setup. Xây dựng cấu trúc Atomic Design.
        </div>
      </footer>
    </div>
  )
}
