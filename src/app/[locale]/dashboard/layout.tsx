import { Box, Header, Link, Main, Nav, Paragraph } from '@/components/ui'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box className="min-h-screen rounded-none border-0 bg-transparent p-0 shadow-none">
      <Header className="w-full border-b border-[var(--line-soft)] bg-[var(--surface-strong)] px-4 py-3 sm:px-6 lg:px-8">
        <Box className="mx-auto w-full max-w-7xl rounded-none border-0 bg-transparent p-0 shadow-none">
          <Box className="rounded-none border-0 bg-transparent p-0 shadow-none flex items-center justify-between gap-4">
            <Box className="rounded-none border-0 bg-transparent p-0 shadow-none">
              <Paragraph className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                Workspace
              </Paragraph>
              <Paragraph className="font-display text-xl font-bold text-[var(--text-primary)]">
                Dashboard
              </Paragraph>
            </Box>

            <Nav className="flex items-center rounded-full border border-[var(--line-soft)] bg-white/85 px-2 py-1">
              <Link
                href="/dashboard"
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--background-secondary)] hover:text-[var(--text-primary)]"
              >
                Overview
              </Link>
              <Link
                href="/dashboard/users"
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--background-secondary)] hover:text-[var(--text-primary)]"
              >
                Users
              </Link>
              <Link
                href="/dashboard/settings"
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--background-secondary)] hover:text-[var(--text-primary)]"
              >
                Settings
              </Link>
            </Nav>
          </Box>
        </Box>
      </Header>

      <Main className="px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <Box className="mx-auto w-full max-w-7xl rounded-none border-0 bg-transparent p-0 shadow-none">
          {children}
        </Box>
      </Main>
    </Box>
  )
}
