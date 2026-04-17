
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex-1 flex flex-col pl-64">{children}</div>
    </div>
  )
}
