import { notFound } from 'next/navigation'

import { getUsersPageContent } from './page.content'
import { hasLocale } from '@/lib/i18n/config'

export default async function UsersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()

  const content = getUsersPageContent(locale)

  return (
    <main className="p-8 text-slate-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{content.heading}</h1>
        <p className="text-slate-600 mb-8">{content.subheading}</p>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[400px] flex items-center justify-center text-slate-400">
          {content.placeholder}
        </div>
      </div>
    </main>
  )
}
