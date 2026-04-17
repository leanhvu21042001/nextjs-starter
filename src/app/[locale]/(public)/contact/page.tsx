import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getContactPageContent } from './page.content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { hasLocale } from '@/lib/i18n/config'
import { createLocalizedMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()

  const { meta } = getContactPageContent(locale)

  return createLocalizedMetadata({
    locale,
    pathname: '/contact',
    title: meta.title,
    description: meta.description,
  })
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()

  const content = getContactPageContent(locale)

  return (
    <main className="py-24 px-6 lg:px-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">{content.heading}</h2>
      <p className="text-slate-600 mb-8">{content.subheading}</p>

      <form className="flex flex-col gap-6" action="#">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="first-name">{content.form.firstName}</Label>
            <Input id="first-name" placeholder={content.form.firstNamePlaceholder} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="last-name">{content.form.lastName}</Label>
            <Input id="last-name" placeholder={content.form.lastNamePlaceholder} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{content.form.email}</Label>
          <Input id="email" type="email" placeholder="example@gmail.com" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="message">{content.form.message}</Label>
          <textarea
            id="message"
            rows={4}
            className="flex w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder={content.form.messagePlaceholder}
          />
        </div>
        <Button type="button">{content.form.submit}</Button>
      </form>
    </main>
  )
}
