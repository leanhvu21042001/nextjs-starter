import { DashboardSidebar } from './components/dashboard-sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />
      {/* 
        Sử dụng pl-64 (padding-left 16rem = 64) để nhường không gian cho sidebar đang có position: fixed 
      */}
      <div className="flex-1 flex flex-col pl-64">{children}</div>
    </div>
  )
}
