import { Box } from '@/components/ui'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box className="flex min-h-screen bg-slate-50">
      <Box className="flex-1 flex flex-col pl-64">{children}</Box>
    </Box>
  )
}
