import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Giới thiệu về chúng tôi',
  description:
    'Tìm hiểu về sứ mệnh và cách chúng tôi xây dựng kiến trúc Atomic Design mạnh mẽ với Next.js.',
}

export default function AboutPage() {
  return (
    <main className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-green-600">Về chúng tôi</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Atomic Design & Sức mạnh của Next.js
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Trang này được render bởi Public Layout mà không bị ràng buộc bởi thanh menu bên trái
            của Dashboard. Mọi route nằm trong nhóm (public) đều dễ dàng sử dụng lại layout này.
          </p>

          <div className="mt-10">
            <Link href="/" className="text-green-600 font-semibold hover:text-green-500">
              ← Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
