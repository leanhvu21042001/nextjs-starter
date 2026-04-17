import { notFound } from 'next/navigation'

import { getSettingsPageContent } from './page.content'
import { hasLocale } from '@/i18n/config'

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()

  const content = getSettingsPageContent(locale)

  return (
    <main className="p-8 text-slate-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{content.heading}</h1>
        <p className="text-slate-600 mb-8">{content.subheading}</p>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-slate-100 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{content.accountInfo.title}</h3>
            <p className="text-sm text-slate-500">{content.accountInfo.description}</p>
          </div>
          <div className="border border-slate-100 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{content.security.title}</h3>
            <p className="text-sm text-slate-500">{content.security.description}</p>
          </div>
        </div>
      </div>
    </main>
  )
}
