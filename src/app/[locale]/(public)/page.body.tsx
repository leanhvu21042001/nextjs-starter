import { Link } from '@/components/ui/link'
import type { getPublicPageContent } from './page.content'

type PublicPageContent = ReturnType<typeof getPublicPageContent>

export default function PageBody({ content }: { content: PublicPageContent }) {
  return (
    <main className="min-h-[70vh] bg-white">
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          {content.hero.title}
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">{content.hero.description}</p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="rounded-md bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
          >
            {content.hero.primaryCta}
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-slate-900 hover:text-green-700"
          >
            {content.hero.secondaryCta}
          </Link>
        </div>
      </section>
    </main>
  )
}
