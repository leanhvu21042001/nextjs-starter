'use client'

import Link from 'next/link'
import { authService } from '@/services/auth.service'
import { usePathname } from 'next/navigation'

/**
 * Organism Component: Sidebar
 * Gắn kết các UI state (active tab) và Logic đăng xuất
 */
export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen p-4 flex flex-col fixed left-0 top-0">
      <div className="text-xl font-bold text-green-400 mb-8 mt-4 px-4">Admin Dashboard</div>

      <nav className="flex-1 flex flex-col gap-2">
        <Link
          href="/dashboard"
          className={`px-4 py-3 rounded-lg text-sm font-medium transition ${pathname === '/dashboard' ? 'bg-green-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          Quản lý Task (DataGrid)
        </Link>
        <Link
          href="/dashboard/users"
          className={`px-4 py-3 rounded-lg text-sm font-medium transition ${pathname === '/dashboard/users' ? 'bg-green-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          Người dùng
        </Link>
        <Link
          href="/dashboard/settings"
          className={`px-4 py-3 rounded-lg text-sm font-medium transition ${pathname === '/dashboard/settings' ? 'bg-green-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          Cài đặt chung
        </Link>
        <Link
          href="/"
          className="mt-6 px-4 py-3 rounded-lg text-sm font-medium hover:bg-slate-800 transition"
        >
          ⭠ Xem trang Public
        </Link>
      </nav>

      <button
        onClick={() => authService.logout()}
        className="mt-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white text-left rounded-lg text-sm font-medium transition"
      >
        Đăng xuất
      </button>
    </aside>
  )
}
