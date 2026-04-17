import { Box, Heading, Link, Main, Paragraph, Section } from '@/components/ui'
import type { getPublicPageContent } from './page.content'

type PublicPageContent = ReturnType<typeof getPublicPageContent>

export default function PageBody({ content }: { content: PublicPageContent }) {
  return (
    <Main className="relative min-h-[74vh] overflow-hidden px-4 pb-14 pt-10 sm:px-6 lg:px-8">
      <Box className="pointer-events-none absolute inset-0 rounded-none border-0 bg-transparent p-0 shadow-none">
        <Box className="absolute -left-20 top-24 h-64 w-64 rounded-full border-0 bg-[rgba(15,159,76,0.12)] p-0 shadow-none blur-3xl" />
        <Box className="absolute -right-10 bottom-16 h-72 w-72 rounded-full border-0 bg-[rgba(242,182,61,0.2)] p-0 shadow-none blur-3xl" />
      </Box>

      <Section className="relative mx-auto max-w-6xl text-center">
        <Box className="animate-fade-up mx-auto inline-flex rounded-full border border-[var(--line-soft)] bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[var(--text-secondary)] shadow-[0_6px_16px_rgba(15,29,50,0.08)]">
          Production Ready Starter
        </Box>

        <Heading
          level={1}
          className="animate-fade-up-delay mx-auto mt-7 max-w-4xl text-balance font-display text-4xl font-bold leading-[1.1] text-[var(--text-primary)] sm:text-5xl lg:text-6xl"
        >
          {content.hero.title}
        </Heading>

        <Paragraph className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-[var(--text-secondary)]">
          {content.hero.description}
        </Paragraph>

        <Box className="mx-auto mt-10 flex w-full max-w-3xl flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface)] p-4 shadow-[0_14px_36px_rgba(15,29,50,0.1)] backdrop-blur md:flex-row">
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--brand)] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(15,159,76,0.35)] transition hover:-translate-y-0.5 hover:bg-[var(--brand-deep)] md:w-auto"
          >
            {content.hero.primaryCta}
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex w-full items-center justify-center rounded-xl border border-[var(--line-soft)] bg-white px-6 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[rgba(15,159,76,0.35)] hover:text-[var(--brand-deep)] md:w-auto"
          >
            {content.hero.secondaryCta}
          </Link>
        </Box>

        <Box className="mx-auto mt-10 grid max-w-4xl rounded-none border-0 bg-transparent p-0 shadow-none gap-4 text-left sm:grid-cols-3">
          <Box className="rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-strong)] p-4 shadow-[0_8px_20px_rgba(15,29,50,0.07)]">
            <Paragraph className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
              Type-safe
            </Paragraph>
            <Paragraph className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
              Forms and schemas aligned from UI to actions.
            </Paragraph>
          </Box>
          <Box className="rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-strong)] p-4 shadow-[0_8px_20px_rgba(15,29,50,0.07)]">
            <Paragraph className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
              Reusable UI
            </Paragraph>
            <Paragraph className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
              Shared components with predictable behavior.
            </Paragraph>
          </Box>
          <Box className="rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-strong)] p-4 shadow-[0_8px_20px_rgba(15,29,50,0.07)]">
            <Paragraph className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
              Locale-aware
            </Paragraph>
            <Paragraph className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
              Routing and content patterns ready for scale.
            </Paragraph>
          </Box>
        </Box>
      </Section>
    </Main>
  )
}
